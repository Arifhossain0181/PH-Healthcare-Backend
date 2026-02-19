import { Specialty } from "../../../../prisma/generated/prisma";
import { ICreateDoctorPlayload } from "./user.interface";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { Role } from "../../../../prisma/generated/prisma";
import { CreateAdminInput, CreateSuperAdminInput } from "./user.validation";
import APPError from "../../errorhelPers/APPError";
import status from "http-status";

const createAdmin = async (payload: CreateAdminInput) => {
  const userExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (userExists) {
    throw new APPError("User already exists with this email", status.CONFLICT);
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: Role.ADMIN,
      needPasswordReset: true,
      status: "ACTIVE",
    },
  });

  if (!userData.user?.id) {
    throw new APPError("Failed to create admin user", status.INTERNAL_SERVER_ERROR);
  }

  return {
    id: userData.user.id,
    name: userData.user.name,
    email: userData.user.email,
    role: Role.ADMIN,
    status: "ACTIVE",
    message: "Admin created successfully",
  };
};

const createSuperAdmin = async (payload: CreateSuperAdminInput) => {
  const userExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (userExists) {
    throw new APPError("User already exists with this email", status.CONFLICT);
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: Role.SUPER_ADMIN,
      needPasswordReset: true,
      status: "ACTIVE",
    },
  });

  if (!userData.user?.id) {
    throw new APPError("Failed to create super admin user", status.INTERNAL_SERVER_ERROR);
  }

  return {
    id: userData.user.id,
    name: userData.user.name,
    email: userData.user.email,
    role: Role.SUPER_ADMIN,
    status: "ACTIVE",
    message: "Super Admin created successfully",
  };
};

const createDoctor = async (payload: ICreateDoctorPlayload) => {
  const specialities: Specialty[] = [];
  for (const specialty of payload.specialties) {
    const existingSpecialty = await prisma.specialty.findUnique({
      where: { id: specialty },
    });
    if (!existingSpecialty) {
      throw new Error(`Specialty with id ${specialty} does not exist`);
    }
    specialities.push(existingSpecialty);
  }
  const userExists = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });
  if (userExists) {
    throw new Error("User already exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      name: payload.doctor.name,
      role: Role.DOCTOR,
      needPasswordReset: true,
      status: "ACTIVE",
    },
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctor = await tx.doctor.create({
        data: {
          userId: userData.user?.id || "",
          name: payload.doctor.name,
          email: payload.doctor.email,
          ProfilePhoto: payload.doctor.profilePhoto,
          contactNumber: payload.doctor.contactNumber,
          address: payload.doctor.address,
          specialization: payload.doctor.specialization,
          experience: payload.doctor.experience,
          gender: payload.doctor.gender,
          registrationNumber: payload.doctor.registrationNumber,
          appointmentFee: payload.doctor.appointmentFee,
          qualifications: payload.doctor.qualifications,
          curreentWorkingPlace: payload.doctor.curreentWorkingPlace,
          designation: payload.doctor.designation,
        },
      });
      const doctorSpecialtyData = payload.specialties.map((specialtyId) => ({
        doctorId: doctor.id,
        specialtyId: specialtyId,
      }));
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });
      const doctorWithSpecialties = await tx.doctor.findUnique({
        where: {
          id: doctor.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          ProfilePhoto: true,
          contactNumber: true,
          address: true,
          specialization: true,
          experience: true,
          gender: true,
          registrationNumber: true,
          appointmentFee: true,
          qualifications: true,
          curreentWorkingPlace: true,
          designation: true,
          averageRating: true,
          isDeleted: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
              image: true,
              isDeleted: true,
              needPasswordReset: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
            },
          },
        },
      });
      return doctorWithSpecialties;
    });
    return result;
  } catch (error) {
    console.log("Error creating doctor profile:", error);
    await prisma.user.delete({
      where: { id: userData.user?.id || "" },
    });
    throw error;
  }
};

export const UserService = {
  createAdmin,
  createSuperAdmin,
  createDoctor,
};

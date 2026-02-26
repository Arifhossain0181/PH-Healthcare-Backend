import { prisma } from "../../lib/prisma"
import { IUPdateDoctorProfilePayload } from "./doctor.interface";
import { Doctor, Gender, Prisma } from "../../../../prisma/generated/prisma";
import { QueryBuilder } from "../../ulitis/QueryBuilder";
import { doctorfilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.const";

 
const getAlldocors = async (IQueryParams: Record<string, unknown>) => {
  // doctors?sPecialty=cardiology&include=doctorschedules.aPPOINTMENTs
    // const doctors = await prisma.doctor.findMany({
    //   where: { isDeleted: false ,
          
    //   },
    //     include: {
    //         user: true,
    //         specialties: {
    //             include: {
    //                 specialty: true
    //             }
    //         },
              
    //     }
    // })
    // return doctors;

    const queryBuilder = new QueryBuilder<Doctor,Prisma.DoctorWhereInput,Prisma.DoctorInclude>(prisma.doctor ,IQueryParams, {
      searchableFields: doctorSearchableFields,
      filterableFields: doctorfilterableFields
    })
    const result = await queryBuilder
      .search()
      .filter()
      .where({ isDeleted: false })
      .include({
        user: true,
        specialties: {
          include: { specialty: true },
        },
      })
      .dynamicInclude(doctorIncludeConfig, ['user', 'specialties'])
      .sort()
      .paginate()
      .fields()
      .exec();
    return result;
}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: true,}
    })
    if (!doctor) {
        throw new Error("Doctor not found");
    }
    return doctor;
}
const updateDoctor = async (
  id: string,
  payload: IUPdateDoctorProfilePayload
) => {
  //  Check doctor exists
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!isDoctorExist) {
    throw new Error("Doctor not found");
  }

  const { password, doctor: doctorData, specialties } = payload;

  // Update user password if provided
  if (password) {
    await prisma.account.updateMany({
      where: { userId: isDoctorExist.userId },
      data: { password },
    });
  }

  // Update doctor data if provided
  if (doctorData) {
    const doctorUpdateData = {
      name: doctorData.name,
      email: doctorData.email,
      ProfilePhoto: doctorData.ProfilePhoto || doctorData.profilePhoto, // Handle both cases
      contactNumber: doctorData.contactNumber,
      address: doctorData.address,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      gender: doctorData.gender ? (doctorData.gender as Gender) : undefined,
      registrationNumber: doctorData.registrationNumber,
      appointmentFee: doctorData.appointmentFee,
      qualifications: doctorData.qualifications,
      curreentWorkingPlace: doctorData.curreentWorkingPlace,
      designation: doctorData.designation,
    };
    await prisma.doctor.update({
      where: { id },
      data: doctorUpdateData,
    });
  }

  // Update specialties if provided
  if (specialties && specialties.length > 0) {
    // First, remove existing specialties
    await prisma.doctorSpecialty.deleteMany({
      where: { doctorId: id },
    });

    // Then add new specialties
    const specialtyConnections = specialties.map(specialtyId => ({
      doctorId: id,
      specialtyId,
    }));

    await prisma.doctorSpecialty.createMany({
      data: specialtyConnections,
    });
  }

  // Fetch the updated doctor with all relations
  const updatedDoctor = await prisma.doctor.findUnique({
    where: { id },
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
          specialty: true,
        },
      },
    },
  });

  return updatedDoctor;
};

const softDeleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
    });
    if (!doctor) {
        throw new Error("Doctor not found");
    }
    
    const deletedDoctor = await prisma.doctor.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    
    return deletedDoctor;
};
    
export const DoctorService = {
    getAlldocors,
    getDoctorById,
    updateDoctor,
    softDeleteDoctor
};

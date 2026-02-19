import { auth } from "../../lib/auth";
import { UserStatus } from "../../../../prisma/generated/prisma";
//import { Role} from "../../../../prisma/generated/prisma";
import { prisma } from "../../lib/prisma";
import { tokenUtilits } from "../../ulitis/token";

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPaitent = async (payload: RegisterPatientPayload) => {
  if (!payload?.name || !payload?.email || !payload?.password) {
    throw new Error("Name, email, and password are required");
  }
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      // role: Role.PATIENT,
      // status: UserStatus.ACTIVE
    },
  });
  if (!data.user) {
    throw new Error("User registration failed");
  }

  //todo: create patient profile in the database
  const Patient = await prisma.$transaction(async (tx) => {
    try {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      const  accesstoken = tokenUtilits.getAccessTokenFromHeader({
    userId: patientTx.userId,
    email: patientTx.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,

  });
  const refreshToken = tokenUtilits.getRefreshTokenFromHeader({
    userId: patientTx.userId,
    email: patientTx.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,

  });



      return {
        ...patientTx,        accessToken: accesstoken,
        refreshToken
      }
    } catch (error) {
      console.log("Error creating patient profile:", error);
      await prisma.user.delete({
        where: { id: data.user.id },
      });
      throw error;
    }
  });
  return { ...data, patient: Patient };
};

interface LoginPayload {
  email: string;
  password: string;
}

const login = async (payload: LoginPayload) => {
  const { email, password } = payload;
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (result.user.status === UserStatus.BLOCKED) {
    throw new Error("Your account is blocked. Please contact support.");
  }
  if (result.user.status === UserStatus.DELETED) {
    throw new Error("Your account is deleted. Please contact support.");
  }

  const  accesstoken = tokenUtilits.getAccessTokenFromHeader({
    userId: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role,
    status: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,

  });
  const refreshToken = tokenUtilits.getRefreshTokenFromHeader({
    userId: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role,
    status: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,

  });


  return { ...result, accessToken: accesstoken, refreshToken }; 
};
export const authService = {
  registerPaitent,
  login,
};

import { auth } from "../../lib/auth";
import {  UserStatus } from "../../../../prisma/generated/prisma";
//import { Role} from "../../../../prisma/generated/prisma";
import { prisma } from "../../lib/prisma";
import { tokenUtilits } from "../../ulitis/token";
import { IRequest } from "../../interface/request.interface";
import jwtUtils from "../../ulitis/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IchangePassword } from "./auth.interface";


type BetterAuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  status?: string;
  isDeleted?: boolean;
  emailVerified?: boolean;
};

type BetterAuthSessionObj = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type BetterAuthSessionResult = {
  session: BetterAuthSessionObj;
  user: BetterAuthUser;
};

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

const getMe = async (user: IRequest) => {
  const userexits = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include:{
          appointments: true,
          medicalReports: true,
          prescriptions: true,
          reviews: true,
        }
      },
      doctor:{
        include:{
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions : true,
        }
      },
    
    },
  });
  if (!userexits) {
    throw new Error("User not found");
  }
  return userexits;
}

const getNewAccessToken = async (sessionToken: string, refreshToken: string) => {
  if (!sessionToken) {
    throw new Error("Session token required");
  }
  const issessiontokenexits = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    }
  });
  if (!issessiontokenexits) {
    throw new Error("Invalid session token");
  }

  const verfitedRefreshToken =jwtUtils.verifytoken(refreshToken ,envVars.REFRESH_TOKEN_SECRET);
  



  if (!verfitedRefreshToken.success && verfitedRefreshToken.error) {
    throw new Error("Invalid refresh token");
    

  }
  const data = verfitedRefreshToken as JwtPayload
    const  newaccesstoken = tokenUtilits.getAccessTokenFromHeader({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,

  });
  const newrefreshToken = tokenUtilits.getRefreshTokenFromHeader({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,

  });
  const {token} = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      updatedAt: new Date(),
    },
  })
  return { accessToken: newaccesstoken,
    refreshToken: newrefreshToken,
    sessionToken: token
  }
}


const changePassword = async (payload: IchangePassword, sessionToken: string) => {
  const session = await auth.api.getSession({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!session || !session.user) {
    throw new Error("Invalid session");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (session.user.needPasswordReset) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordReset: false },
    });
  }
  

  const  accesstoken = tokenUtilits.getAccessTokenFromHeader({
    userId: session.user.id,
    email: result.user.email,
    name: result.user.name,
    role: result.user.role,
    status: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,

  });
  const refreshToken = tokenUtilits.getRefreshTokenFromHeader({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,

  });

  return { ...result, accessToken: accesstoken, refreshToken }; 
}

const logout = async (sessionToken: string) => {

  const result = await auth.api.signOut({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  return result;
}
const verifyEmail = async( email : string ,otp : string) => {
      const result = await auth.api.verifyEmailOTP({
       body:{
        email,
        otp
       }
      });
      if(result.status && !result.user.emailVerified){
        await prisma.user.update({
            where:{email},
            data:{emailVerified:true}
        })
      }
}

const forgetPassword = async (email: string) => {
  const isUserExits = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExits) {
    throw new Error("User with this email does not exist");
  }
  if(isUserExits.emailVerified){
    throw new Error("Email is already verified. Please login or use forgot password option.");
  }
  if(isUserExits.isDeleted || isUserExits.status === UserStatus.DELETED){
    throw new Error("Your account is deleted. Please contact support.");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  })

}

const restPasword = async (email: string, otp: string, newPassword: string) => {
  const isUserExits = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExits) {
    throw new Error("User with this email does not exist");
  } 
  if(!isUserExits.emailVerified){
    throw new Error("Email is not verified. Please verify your email first.");
  }
  if(isUserExits.isDeleted || isUserExits.status === UserStatus.DELETED){
    throw new Error("Your account is deleted. Please contact support.");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  })
  if(isUserExits.needPasswordReset){
    await prisma.user.update({
      where: { email },
      data: { needPasswordReset: false },
    });
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExits.id,
    },
  })

}
const googleLoginSuccess = async (session: BetterAuthSessionResult) => {
  const isPatitentExits = await prisma.patient.findUnique({
    where: {
      userId: session.user.id,

    },

  })
  if(!isPatitentExits){
     await prisma.patient.create({
      data: {
        userId: session.user.id,
        name: session.user.name || "Patient", 
        email: session.user.email ?? "" ,
     }})
    }
    const accesstoken = tokenUtilits.getAccessTokenFromHeader({
      userId: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
      role: String(session.user.role ?? ""),
      status: String(session.user.status ?? ""),
      isDeleted: Boolean(session.user.isDeleted),
      emailVerified: Boolean(session.user.emailVerified),
    })
    const refreshToken = tokenUtilits.getRefreshTokenFromHeader({
      userId: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
      role: String(session.user.role ?? ""),
      status: String(session.user.status ?? ""),
      isDeleted: Boolean(session.user.isDeleted),
      emailVerified: Boolean(session.user.emailVerified),
    })
    return {
      accessToken: accesstoken,
      refreshToken
    }
}




export const authService = {
  registerPaitent,
  login,
  getMe,
  getNewAccessToken,
  changePassword,
  logout ,
  verifyEmail,
  forgetPassword,
  restPasword,
  googleLoginSuccess
};

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../../prisma/generated/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  user:{
    additionalFields:{
      role:{
        type:"string",
        defaultValue:Role.PATIENT,
        required:true
        
      },
      status:{
        type:"string",
        defaultValue:UserStatus.ACTIVE,
        required:true,
      },
      needPasswordReset:{
        type:"boolean",
        defaultValue:false,
        required:true,
      },
      isDeleted:{ 
        type:"boolean",
        defaultValue:false,
        required:true,
      }
    }
  },

  
  trustedOrigins:[ process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced:{
    disableCSRFCheck: true
  }
});

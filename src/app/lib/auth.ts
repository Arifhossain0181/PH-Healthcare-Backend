import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../../prisma/generated/prisma";
import { bearer } from "better-auth/plugins/bearer";


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
  plugins: [
    bearer()

  ],
  session:{
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // 1 day in seconds  
    cookieCache: {
      enabled: false, // Disable to avoid maxAge issues
    }
  },

  
  trustedOrigins:[ process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced:{
    disableCSRFCheck: true
  }
});

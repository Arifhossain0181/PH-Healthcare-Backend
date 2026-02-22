import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../../prisma/generated/prisma";
import { bearer } from "better-auth/plugins/bearer";
import { emailOTP } from "better-auth/plugins/email-otp";

import { sendEmail } from "../ulitis/email";
import { envVars } from "../config/env";

// Determine whether cookies must be secure (for production / HTTPS)
const isSecureCookie = (envVars.BETTER_AUTH_URL || "").startsWith("https") || envVars.NODE_ENV === "production";
const cookieSameSite = isSecureCookie ? "none" as const : "lax" as const;

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL || "http://localhost:5000",
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID || "",
      clientSecret: envVars.GOOGLE_CLIENT_SECRET || "",
      enabled: true,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          role: Role.PATIENT,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          isDeleted: false,
          needPasswordReset: false,
          deleteAt: null,
        };
      },
    },
  },

  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.PATIENT,
        required: true,
      },
      status: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: true,
      },
      needPasswordReset: {
        type: "boolean",
        defaultValue: false,
        required: true,
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: true,
      },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
              templateName: "OPT",
              templateData: { name: user.name || "User", otp },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            sendEmail({
              to: email,
              subject: "Reset your password",
              html: `<p>Your password reset code is: <strong>${otp}</strong></p>`,
              templateName: "RESET_PASSWORD",
              templateData: { name: user.name || "User", otp },
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: false,
    },
  },

  redirectURLs: {
    signIn: envVars.GOOGLE_CALLBACK_URI || `${envVars.BETTER_AUTH_URL || "http://localhost:5000"}/api/v1/auth/google/success`,
  },

  trustedOrigins: [envVars.BETTER_AUTH_URL || "http://localhost:5000"],

  advanced: {
    disableCSRFCheck: false,
    cookies: {
      state: {
        attributes: {
          sameSite: cookieSameSite,
          secure: isSecureCookie,
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: cookieSameSite,
          secure: isSecureCookie,
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});

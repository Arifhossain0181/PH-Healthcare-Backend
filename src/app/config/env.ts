
import dotenv from "dotenv";
import APPError from "../errorhelPers/APPError";
import status from "http-status";
dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
     BETTER_AUTH_SECRET: string;    
    BETTER_AUTH_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN : string;
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE : string;
    EMAIL_SENDER_SMTP_USER: string;
    EMAIL_SENDER_SMTP_PASSWORD: string;
    EMAIL_SENDER_SMTP_HOST: string;
    EMAIL_SENDER_SMTP_PORT: number;
    EMAIL_SENDER_SMTP_SECURE: boolean;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URI: string;
    FRONTEND_URL: string;
      
}

const loadenv = (): EnvConfig => {
    const requiredVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL',
    'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'ACCESS_TOKEN_EXPIRES_IN', 'REFRESH_TOKEN_EXPIRES_IN',
    'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN', 'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
    'EMAIL_SENDER_SMTP_USER', 'EMAIL_SENDER_SMTP_PASSWORD', 'EMAIL_SENDER_SMTP_HOST', 'EMAIL_SENDER_SMTP_PORT', 'EMAIL_SENDER_SMTP_SECURE',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URI', 'FRONTEND_URL'
    ];
    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new APPError(`Environment variable ${varName} is required but not defined`, status.INTERNAL_SERVER_ERROR);
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
        EMAIL_SENDER_SMTP_PASSWORD: process.env.EMAIL_SENDER_SMTP_PASSWORD as string,
        EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
        EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT ? parseInt(process.env.EMAIL_SENDER_SMTP_PORT) : 465,
        EMAIL_SENDER_SMTP_SECURE: process.env.EMAIL_SENDER_SMTP_SECURE === 'true',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URI: process.env.GOOGLE_CALLBACK_URI as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    }
}
export const envVars = loadenv();


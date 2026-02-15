
import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
     BETTER_AUTH_SECRET: string;    
    BETTER_AUTH_URL: string;
}

const loadenv = (): EnvConfig => {
    const requiredVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'];
    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is required but not defined. not in .env file or system environment variables.`);
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string
    }
}
export const envVars = loadenv();


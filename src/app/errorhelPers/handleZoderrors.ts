import z from "zod";
import status from "http-status";
import { TErrorSources } from "../interface/error.interface";

export const handleZodErrors = (error: z.ZodError) => {
    const statusCode = status.BAD_REQUEST;
    const message = "Validation error Zod validation failed";
    const errorSources: TErrorSources[] = [];
    error.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path.join(".") || "unknown",
            message: issue.message,
        });
    });
    return {
        statusCode,
        message,
        errorSources,
    };
};
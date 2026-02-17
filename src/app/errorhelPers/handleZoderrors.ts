import z from "zod";
import status from "http-status";
interface TErrorSoucrece{
    path: string;
    message: string;
}

export const handleZodErrors = (error: z.ZodError) => {
    const  statusCode = status.BAD_REQUEST;
 const    message = "Validation error Zod validation failed";
    const errorsoucrce: TErrorSoucrece[] = [];
    error.issues.forEach((error) => {
        errorsoucrce.push({
            path: error.path.join(".") || "unknown",
            message: error.message
        });
    });
    return {
        statusCode,
        message,
        errorsoucrce
    };
}
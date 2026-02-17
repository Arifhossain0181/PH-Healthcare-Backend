/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";
import z from "zod";
import { error } from "node:console";
import { handleZodErrors } from "../errorhelPers/handleZoderrors";
interface TErrorSoucrece{
    path: string;
    message: string;


}
export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if(envVars.NODE_ENV === "development"){
        console.error("Error from global error handler:",err);
    }
    const errorsoucrce: TErrorSoucrece[] = []
   let statusCode: number = status.INTERNAL_SERVER_ERROR;
let message: string = "Internal server error";
let stack: string | undefined = undefined


if (err instanceof z.ZodError) {
    const simPlidirdEror = handleZodErrors(err);
    statusCode = simPlidirdEror.statusCode;
    message = simPlidirdEror.message;
    errorsoucrce.push(...simPlidirdEror.errorsoucrce);
}
else if(err instanceof Error){
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message || "Internal server error";
    stack = err.stack;
}
      

   
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSource: errorsoucrce,
        error: envVars.NODE_ENV === "development" ? stack : undefined,
    });
}
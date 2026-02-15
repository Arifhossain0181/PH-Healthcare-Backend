/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";
export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if(envVars.NODE_ENV === "development"){
        console.error("Error from global error handler:",err);
    }
   const statusCode: number = status.INTERNAL_SERVER_ERROR;
const message: string = "Internal server error";


   
    res.status(statusCode).json({
      success: false,
      message: message,
      error: err.message || "An unknown error occurred"
    })
}
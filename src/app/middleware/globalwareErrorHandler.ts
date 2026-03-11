/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";
import z from "zod";
import { handleZodErrors } from "../errorhelPers/handleZoderrors";
import { deleteUploadedFileFromGlobalError } from "../ulitis/deleteuPloadedfileFromGlobal.error";
import { Prisma } from "../../../prisma/generated/prisma";
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError } from "../errorhelPers/handle.Prisma.Errors";
import { TErrorSources } from "../interface/error.interface";

export const globalErrorHandler = async (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from global error handler:", err);
  }

  await deleteUploadedFileFromGlobalError(req);

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";
  let stack: string | undefined = undefined;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplified = handlePrismaClientKnownRequestError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...(simplified.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const simplified = handlePrismaClientUnknownError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...(simplified.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplified = handlePrismaClientValidationError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...(simplified.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    const simplified = handlerPrismaClientRustPanicError();
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...(simplified.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    const simplified = handlerPrismaClientInitializationError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...(simplified.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplified = handleZodErrors(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources.push(...(simplified.errorSources || []));
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message || "Internal server error";
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message || "Internal server error",
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources: errorSources,
    error: envVars.NODE_ENV === "development" ? stack : undefined,
  });
};

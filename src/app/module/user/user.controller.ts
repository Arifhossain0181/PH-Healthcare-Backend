import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResPonse";
import status from "http-status";
import { createAdminZod, createSuperAdminZod, createDoctorZod } from "./user.validation";

const createAdmin = catchAsync(
    async(req: Request, res: Response) => {
        const payload = createAdminZod.parse(req.body);
        const result = await UserService.createAdmin(payload);
        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Admin created successfully",
            data: result
        });
    }
);

const createSuperAdmin = catchAsync(
    async(req: Request, res: Response) => {
        const payload = createSuperAdminZod.parse(req.body);
        const result = await UserService.createSuperAdmin(payload);
        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Super Admin created successfully",
            data: result
        });
    }
);

const createDoctor = catchAsync(
    async(req:Request, res:Response) => {
        const payload = createDoctorZod.parse(req.body);
        const result = await  UserService.createDoctor(payload);
        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Doctor created successfully",
            data: result
        })
    }
);

export const UserController = {
    createAdmin,
    createSuperAdmin,
    createDoctor
};
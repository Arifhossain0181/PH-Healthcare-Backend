import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResPonse";
import status from "http-status";

const getAllDoctors = catchAsync(
    async(req: Request, res: Response) => {
        const result = await DoctorService.getAlldocors();
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctors retrieved successfully",
            data: result
        });
    }
);

const getDoctorById = catchAsync(
    async(req: Request, res: Response) => {
        const { id } = req.params;
        const result = await DoctorService.getDoctorById(id as string);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor retrieved successfully",
            data: result
        });
    }
);
const updateDoctor = catchAsync(
    async(req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
        const result = await DoctorService.updateDoctor(id as string, payload);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor profile updated successfully",
            data: result
        });
    }
);

const softDeleteDoctor = catchAsync(
    async(req: Request, res: Response) => {
        const { id } = req.params;
        await DoctorService.softDeleteDoctor(id as string);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Doctor deleted successfully",
        });
    }
);



export const DoctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    softDeleteDoctor
};
        
       
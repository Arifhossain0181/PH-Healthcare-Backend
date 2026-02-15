import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResPonse";
import status from "http-status";

const createDoctor = catchAsync(
    async(req:Request ,res:Response) => {
        const payload = req.body;
        console.log(payload)
        const result = await  UserService.createDoctor(payload);
        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Doctor created successfully",
            data: result
        })
        })

export const UserController = {
    createDoctor
}
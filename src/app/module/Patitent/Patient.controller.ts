import { IRequest } from "../../interface/request.interface";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { PatientService } from "./Patient.service";

const updateMyProfile = catchAsync(async (req:Request, res:Response) => {
    const user = req.user as IRequest
    const payload = req.body;
    const result = await PatientService.updateMyProfile(user, payload);
    res.status(200).json({
        success : true,
        message : "Profile updated successfully",
        data : result
    })

})
export const PatientController = {
    updateMyProfile
}
import {  Request,  Response } from "express";
import { specialityService } from "./sPecility.server";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";




const createSpeciality = catchAsync( async(req: Request ,res: Response) => {
    const payload = req.body
    const result = await specialityService.createSpeciality(payload)
    sendResponse(res, {
        httpStatus: 201,
        success: true,
        message: "Speciality created successfully",
        data: result
    })
})

const getAllSpeciality = catchAsync( async(req: Request ,res: Response) => {
    const result = await specialityService.getAllSpeciality()
    res.status(200).json({
        message: "Speciality retrieved successfully",
        data: result
    })
})


const deleteSpeciality = catchAsync( async (req: Request ,res: Response) => {
    const id = req.params.id
    const result = await specialityService.deleteSpeciality(id as string);
    res.status(200).json({
        message: "Speciality deleted successfully",
        data: result
    })
})


  
const uPdateSpeciality = catchAsync( async (req: Request ,res: Response) => {
    const id = req.params.id
    const payload = req.body
    const result = await specialityService.updateSpeciality(id as string, payload);
    res.status(200).json({
        message: "Speciality updated successfully",
        data: result})
  })













export const specialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality,
     uPdateSpeciality
}
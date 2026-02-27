
import { Request, Response } from "express";
import { doctorScheduleService } from "./doctorSchedule.service";
import catchAsync from "../../shared/catchAsync";


const createDoctorSchedule = catchAsync(async (req: Request, res:Response) => {
    const payload =  req.body
    const user = req.user 
    const dorctorschedule =await doctorScheduleService.createdoctorSchedule (user, payload);
    return res.status(201).json({
        message : "Doctor schedule created successfully",
        data : dorctorschedule,
        success : true
    })
})
const getMyAllSchedules = catchAsync(async (req: Request, res:Response) => {
    const query = req.query
    const user = req.user
    const result = await doctorScheduleService.getMyAllSchedules(query, user );
    return res.status(200).json({
        message : "Doctor schedules retrieved successfully",
        data : result.data,
        success : true,
        meta : result.meta
    })
})
const getAllSchedules = catchAsync(async (req: Request, res:Response) => {
    const query = req.query
    const result = await doctorScheduleService.getAllSchedules(query);
    return res.status(200).json({
        message : "Doctor schedules retrieved successfully",
        data : result.data,
        success : true,
        meta : result.meta
    })
})
const getdoctorScheduleById = catchAsync(async (req: Request, res:Response) => {
    const {id} = req.params
    const result = await doctorScheduleService.getdoctorScheduleById(id as string);
    return res.status(200).json({
        message : "Doctor schedule retrieved successfully",
        data : result,
        success : true,
    })
})
const uPdateDoctorSchedule = catchAsync(async (req: Request, res:Response) => {
    const payload =  req.body
    const user = req.user 
    
    const dorctorschedule =await doctorScheduleService.uPdateDoctorSchedule (user, payload);
    return res.status(200).json({
        message : "Doctor schedule updated successfully",
        data : dorctorschedule,
        success : true
    })
})
const deleteDoctorSchedule = catchAsync(async (req: Request, res:Response) => {
     const {id} = req.params
     const user = req.user
     const result = await doctorScheduleService.deleteDoctorSchedule(id as string, user);
     return res.status(200).json({
        message : "Doctor schedule deleted successfully",
        data : result,
        success : true,
    })
})
export const doctorScheduleController = {
    createDoctorSchedule,
    uPdateDoctorSchedule,
    getMyAllSchedules,
    getAllSchedules,
    getdoctorScheduleById,
    deleteDoctorSchedule
}
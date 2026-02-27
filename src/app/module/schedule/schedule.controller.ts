import catchAsync from "../../shared/catchAsync";
import { IQueryParams } from "./schedule.interface";
import  { scheduleService } from "./schedule.service";
import { Request, Response } from "express";
import status from "http-status";


const createschedule = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    const schedule = await scheduleService.createschedules(payload);
    res.status(status.CREATED).json({
        success: true,
        message: "Schedule created successfully",
        data: schedule
    })
})

const getAllSchedules = catchAsync(async (req:Request, res:Response) => {
    const query = req.query
    const result = await scheduleService.getAllSchedules(query as unknown as IQueryParams)
    res.status(status.OK).json({
        success: true,
        message: "Schedules retrieved successfully",
        data: result.data,
        meta:result.meta
    })

}
)

const getSingleSchedule = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params
    const schedule = await scheduleService.getSingleSchedule(id as string)
    res.status(status.OK).json({
        success: true,
        message: "Schedule retrieved successfully",
        data: schedule
    })
})
const updateSchedule = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params
    const payload = req.body
    const schedule = await scheduleService.updateSchedule(id as string, payload)
    res.status(status.OK).json({
        success: true,
        message: "Schedule updated successfully",
        data: schedule,

    })

})
const deleteSchedule = catchAsync(async (req:Request, res:Response) => {
    const {id} = req.params
    const schedule = await scheduleService.deleteSchedule(id as string)
    res.status(status.OK).json({
        success: true,
        message: "Schedule deleted successfully",
        data: schedule,
})
})
export const scheduleController = {
    createschedule,
    getAllSchedules,
    getSingleSchedule,  
    updateSchedule,
    deleteSchedule
}
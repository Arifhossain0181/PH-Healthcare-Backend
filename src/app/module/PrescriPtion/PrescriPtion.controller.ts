import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import {   PrescriPtionService } from './PrescriPtion.service';
import sendResponse from '../../shared/sendResPonse';


const givePrescription = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await PrescriPtionService.givePrescription(user, payload);
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

const myPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await PrescriPtionService.getmyPrescription(user);
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription fetched successfully',
        data: result
    });
});

const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const result = await PrescriPtionService.getAllPrescription();
    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescriptions retrieval successfully',
        data: result
    });
});

const updatePrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const prescriptionId = req.params.id;
    const payload = req.body;
    const result = await PrescriPtionService.updatePrescription(user, prescriptionId as string, payload);

    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription updated successfully',
        data: result
    });
});

const deletePrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const prescriptionId = req.params.id;
    await PrescriPtionService.deletePrescription(user, prescriptionId as string);

    sendResponse(res, {
        httpStatus: httpStatus.OK,
        success: true,
        message: 'Prescription deleted successfully',
    });
});

export const PrescriptionController = {
    givePrescription,
    myPrescriptions,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription
};
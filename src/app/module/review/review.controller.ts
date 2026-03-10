import catchAsync from "../../shared/catchAsync";
import { PrescriPtionService } from "../PrescriPtion/PrescriPtion.service";
import { IRequest } from "../../shared/request.interface";
import { Response } from "express";



const giveReview = catchAsync(async (req: IRequest, res: Response) => {
    const payload = req.body;
    const result = await PrescriPtionService.giveReview(req.user, payload);
    res.status(201).json({
        success: true,
        message: "Review given successfully",
        data: result,
    });
})
export const ReviewController = {
    giveReview,
}
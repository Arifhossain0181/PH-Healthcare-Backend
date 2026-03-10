import catchAsync from "../../shared/catchAsync";
import { PrescriPtionService as ReviewService } from "./review.service";

import { Response ,Request} from "express";



const giveReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await ReviewService.giveReview(req.user, payload);
    res.status(201).json({
        success: true,
        message: "Review given successfully",
        data: result,
    });
})
const getAllreview = catchAsync(async (req: Request, res: Response) => {
    
    const result = await ReviewService.getallReview();
    res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        data: result,
    });
})
const myReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.myReview(req.user);
    res.status(200).json({  
        success: true,
        message: "My reviews fetched successfully",
        data: result,
    });
})
const updateReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
    const payload = req.body;
    const result = await ReviewService.updateReview(req.user, reviewId, payload);
    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: result,
    });
})
const deleteReview = catchAsync(async (req: Request, res: Response) => {

    const reviewId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
    const result = await ReviewService.deleteReview(req.user, reviewId);
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
})
export const ReviewController = {
    giveReview,
    getAllreview,
    myReview,
    updateReview,
    deleteReview,
}
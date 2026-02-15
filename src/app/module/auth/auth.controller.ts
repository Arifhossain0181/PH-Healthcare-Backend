import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import { authService } from "./auth.service";
import { Request, Response } from "express";


const register = catchAsync( async(req: Request ,res: Response) => {
       const payload = req.body || {};
       console.log('Received payload:', payload);
       const result = await authService.registerPaitent(payload);
       sendResponse(res ,{
        httpStatus: status.CREATED,
        success: true,
        message: "Patient registered successfully",
        data: result
       })
      
})

const login = catchAsync( async(req: Request ,res: Response) => {
    const payload = req.body || {};
    console.log('Received payload:', payload);
    const result = await authService.login(payload);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Login successful",
        data: result
    })
})
export const authController = {
    register,
    login
}
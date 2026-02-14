import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import { authService } from "./auth.service";
import { Request, Response } from "express";


const register = catchAsync( async(req: Request ,res: Response) => {
       const payload = req.body
       console.log(payload)
       const result = await authService.registerPaitent(payload)
       sendResponse(res ,{
        httpStatus: 201,
        success: true,
        message: "Patient registered successfully",
        data: result
       })
      
})
export const authController = {
    register
}
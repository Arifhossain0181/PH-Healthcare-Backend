import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import { authService } from "./auth.service";
import { Request, Response } from "express";
import { tokenUtilits } from "../../ulitis/token";


const register = catchAsync( async(req: Request ,res: Response) => {
       const payload = req.body || {};
       console.log('Received payload:', payload);
       const result = await authService.registerPaitent(payload);
       
       const { user, token, patient } = result;
       const { accessToken, refreshToken } = patient;
       
       // Set cookies
       tokenUtilits.setaccesstokencookie(res, accessToken);
       tokenUtilits.setrefreshtokencookie(res, refreshToken);
       if (token) {
         tokenUtilits.setBetterAuthCookies(res, token);
       }
       
       sendResponse(res ,{
        httpStatus: status.CREATED,
        success: true,
        message: "Patient registered successfully",
        data: {
            user,
            patient: {
              ...patient,
              accessToken,
              refreshToken
            },
            token,
        }
       })
      
})

const login = catchAsync( async(req: Request ,res: Response) => {
    const payload = req.body || {};
    console.log('Received payload:', payload);
    const result = await authService.login(payload);
    const { accessToken, refreshToken ,...rest} = result;
    
    // Set cookies
    tokenUtilits.setaccesstokencookie(res, accessToken);
    tokenUtilits.setrefreshtokencookie(res, refreshToken);
    tokenUtilits.setBetterAuthCookies(res, result.token);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Login successful",
        data: {
            ...rest,            accessToken,
            refreshToken,
            token: result.token 
        }
    })
})
const getMe = catchAsync( async(req: Request ,res: Response) => {
    const user = req.user;
    const result = await authService.getMe(user);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "User data retrieved successfully",
        data: result
    })
})

const getnewtoken = catchAsync( async(req: Request ,res: Response) => {
    const refreshtoken = req.cookies.refreshToken;
    const betterauthsessionToken = req.cookies["better-auth.session-token"];
    if (!refreshtoken) {
        return sendResponse(res, {
            httpStatus: status.UNAUTHORIZED,
            success: false,
            message: "Refresh token not found",
        });
    }
    const result = await authService.getNewAccessToken(refreshtoken , betterauthsessionToken);
    const {accessToken,refreshToken: newRefreshToken ,sessionToken} = result;
    tokenUtilits.setaccesstokencookie(res, accessToken);
    tokenUtilits.setrefreshtokencookie(res, newRefreshToken);
    tokenUtilits.setBetterAuthCookies(res, sessionToken);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "New access token generated successfully",
        data: {
            accessToken,
            refreshToken: newRefreshToken,
            sessionToken
        }
    })
})

export const authController = {
    register,
    login,
    getMe,
    getnewtoken
}
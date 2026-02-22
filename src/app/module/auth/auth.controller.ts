import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import { authService } from "./auth.service";
import { Request, Response } from "express";
import { tokenUtilits } from "../../ulitis/token";
import { IchangePassword } from "./auth.interface";
import { cookieUtils } from "../../ulitis/cookies";
import { envVars } from "../../config/env";

import { auth } from "../../lib/auth";



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
    // debug cookie contents
    console.log('Refresh cookies:', req.cookies);
    const refreshtoken = req.cookies.refreshToken;
    const betterauthsessionToken = req.cookies["better-auth-session_token"];
    if (!refreshtoken) {
        return sendResponse(res, {
            httpStatus: status.UNAUTHORIZED,
            success: false,
            message: "Refresh token not found",
        });
    }
    if (!betterauthsessionToken) {
        return sendResponse(res, {
            httpStatus: status.UNAUTHORIZED,
            success: false,
            message: "Session token not found",
        });
    }
    const result = await authService.getNewAccessToken(betterauthsessionToken, refreshtoken);
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

const changePassword = catchAsync( async(req: Request ,res: Response) => {
    // normalize casing and pick known fields
    const raw = req.body || {};
    
    const payload: IchangePassword = {
        currentPassword: raw.currentPassword ?? raw.currentpassword ?? raw['current_password'] ?? "",
        newPassword: raw.newPassword ?? raw.newpassword ?? raw['new_password'] ?? "",
    };

    // simple validation
    if (!payload.currentPassword || !payload.newPassword) {
        return sendResponse(res, {
            httpStatus: status.BAD_REQUEST,
            success: false,
            message: "currentPassword and newPassword are required",
        });
    }

    const betterauthsessionToken = req.cookies["better-auth-session_token"];
    if (!betterauthsessionToken) {
        return sendResponse(res, {
            httpStatus: status.UNAUTHORIZED,
            success: false,
            message: "Session token not found",
        });
    }

    const result = await authService.changePassword(payload, betterauthsessionToken);

    const { accessToken, refreshToken } = result;
    tokenUtilits.setaccesstokencookie(res, accessToken);
    tokenUtilits.setrefreshtokencookie(res, refreshToken);
    tokenUtilits.setBetterAuthCookies(res, betterauthsessionToken);


    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Password changed successfully",
        data: result
    })
})

const logout = catchAsync( async(req: Request ,res: Response) => {
    const betterauthsessionToken = req.cookies["better-auth-session_token"];
    const result = await authService.logout(betterauthsessionToken);
    // Clear cookies
    cookieUtils.clearCookies(res,'accessToken',{
        httpOnly: true,
        secure:true,
        sameSite: 'strict',


    })
    cookieUtils.clearCookies(res,'refreshToken',{
        httpOnly: true,
        secure:true,
        sameSite: 'strict',
        

    })
    cookieUtils.clearCookies(res,'better-auth-session_token',{
        httpOnly: true,
        secure:true,
        sameSite: 'strict',
        

    })
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Logged out successfully",
        data: result
    })

})

const verifyEmail = catchAsync( async(req: Request ,res: Response) => {
    const { email, otp } = req.body || {};
    const result = await authService.verifyEmail(email, otp);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Email verification successful",
        data: result
    })
})
const forgetPassword = catchAsync( async(req: Request ,res: Response) => {
    const { email } = req.body || {};
    const result = await authService.forgetPassword(email);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "If a user with that email exists, a password reset link has been sent",
        data: result
    })
})
const restPasword = catchAsync( async(req: Request ,res: Response) => {
    const { email, otp, newPassword } = req.body || {};
    const result = await authService.restPasword(email, otp, newPassword);
    sendResponse(res,{
        httpStatus: status.OK,
        success: true,
        message: "Password reset successful",
        data: result
    })
})

// api/vi1/auth/login/google?redirect=/Profile
const googleLogin = catchAsync( async(req: Request ,res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";
    const endocdedRedirectPath = encodeURIComponent(redirectPath);
    const callbackURL = envVars.GOOGLE_CALLBACK_URI || `${envVars.BETTER_AUTH_URL || "http://localhost:5000"}/api/v1/auth/google/success?redirect=${endocdedRedirectPath}`;
    console.log('googleLogin callbackURL:', callbackURL);
    res.render("google",{
        callbackURL,
        betterAuthURL: envVars.BETTER_AUTH_URL || "http://localhost:5000",
    })
    
})
const googleLoginsuccess = catchAsync( async(req: Request ,res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";
    const sessionToken = req.cookies["better-auth-session_token"];
    if (!sessionToken) {
       return res.redirect(`${envVars.FRONTEND_URL}/login?error=oth_failed`)
    }
    const session = await auth.api.getSession({
        headers: {
            Cookie: `better-auth-session_token=${sessionToken}`,
          },
    })
    if (!session || !session.user) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`)
    }
    const result = await authService.googleLoginSuccess(session);
    const {accessToken, refreshToken} = result;
    tokenUtilits.setaccesstokencookie(res, accessToken);
    tokenUtilits.setrefreshtokencookie(res, refreshToken);
    tokenUtilits.setBetterAuthCookies(res, sessionToken);
    const isValidRedirect = redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirect = isValidRedirect ? redirectPath : "/dashboard";
    res.redirect(`${envVars.FRONTEND_URL}${finalRedirect}`);
})

const oauthError = catchAsync( async(req: Request ,res: Response) => {
        const error = req.query.error as string || "unknown_error oth_failed";
        res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`)


})

export const authController = {
    register,
    login,
    getMe,
    getnewtoken,
    changePassword,
    logout,
    verifyEmail,
    forgetPassword,
    restPasword,
    googleLogin,
    googleLoginsuccess,
    
    oauthError
}
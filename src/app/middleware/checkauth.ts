import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../../prisma/generated/prisma";
import { cookieUtils } from "../ulitis/cookies";
import { prisma } from "../lib/prisma";
import jwtUtils from "../ulitis/jwt";
import { envVars } from "../config/env";
export const checkAuth = (authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {

try{
    const sessionToken = cookieUtils.getCookies(req, "better-auth-session_token");
        if(!sessionToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No session token provided",
        });
    }
    if(sessionToken){
        const sessionExits  = await prisma.session.findFirst({
            where: {
                token: sessionToken,
                expiresAt: {
                    gt: new Date(),
                }
            },  
            include: {
                user: true,
            }
        })
        if(sessionExits && sessionExits.user){
            const user = sessionExits.user;
        const now = new Date();
        const expireAt = new Date(sessionExits.expiresAt);
        const createAt = new Date(sessionExits.createdAt);

        const sessionlidetime = (expireAt.getTime() - createAt.getTime()) / 1000; // in seconds
        const sessionAge = (now.getTime() - createAt.getTime()) / 1000; // in seconds
        const Parcentage = (sessionAge / sessionlidetime) * 100;
        if(Parcentage > 20){
            res.setHeader("x-session-expiring", "true");
            res.setHeader("x-session-expireAt", expireAt.toISOString());
            res.setHeader("x-session-age", sessionAge.toString());
            console.log("session exPrie soon")

        
        }
        if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User is blocked or deleted",
            });
        }
        if(user.isDeleted){
            throw new Error("Unauthorized: User is deleted");
        }
        if(authRoles.length > 0 && !authRoles.includes(user.role)){
            throw new Error("Unauthorized: Insufficient permissions");
        }
 
        const accesstoken = cookieUtils.getCookies(req, "accessToken");
        if(!accesstoken){
            throw new Error("Unauthorized: No access token provided");
        }
        const verfiedToken = jwtUtils.verifytoken(accesstoken, envVars.ACCESS_TOKEN_SECRET);
        if(!verfiedToken.success){
            throw new Error("Unauthorized: Invalid access token");
        }
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Session not found or expired",
        });
    }
    }
}
catch(error){
    next(error);
}
}
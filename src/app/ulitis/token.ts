import { envVars } from "../config/env";
import { cookieUtils } from "./cookies";
import jwtUtils from "./jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";

import { Response } from "express";


const getAccessTokenFromHeader = (payload: JwtPayload) => {
  const expiresIn: SignOptions["expiresIn"] =
    isNaN(Number(envVars.ACCESS_TOKEN_EXPIRES_IN))
      ? (envVars.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"])
      : Number(envVars.ACCESS_TOKEN_EXPIRES_IN);

  const accessToken = jwtUtils.createtoken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn }
  );

  return accessToken;
};

const getRefreshTokenFromHeader = (payload: JwtPayload) => {
  const expiresIn: SignOptions["expiresIn"] =
    isNaN(Number(envVars.REFRESH_TOKEN_EXPIRES_IN))
      ? (envVars.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"])
      : Number(envVars.REFRESH_TOKEN_EXPIRES_IN);

  const refreshToken = jwtUtils.createtoken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn }
  );

  return refreshToken;
};

const setaccesstokencookie = (res: Response, token: string) => {
    cookieUtils.setCookies(res, "accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000, // 1 hour in milliseconds
        path: "/"
    })
}

const setrefreshtokencookie = (res: Response, token: string) => {
    cookieUtils.setCookies(res, "refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 3600 * 1000, // 7 days in milliseconds
        path: "/"
    })
}

const setBetterAuthCookies = (res: Response, token: string) => {
    cookieUtils.setCookies(res, "better-auth-session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 3600 * 1000, // 7 days in milliseconds
        path: "/"
    })
}

export const tokenUtilits= { getAccessTokenFromHeader, getRefreshTokenFromHeader, setaccesstokencookie, setrefreshtokencookie, setBetterAuthCookies };

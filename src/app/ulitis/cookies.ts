import { CookieOptions } from "express"
import { Response ,Request} from "express";

const setCookies = (res: Response,key:string, value: string ,options: CookieOptions) => {
    res.cookie(key, value, options);
}

const getCookies = (req: Request, key: string) => {
  return req.cookies[key];
}
const clearCookies = (res: Response, key: string) => {
    res.clearCookie(key);
}
export const cookieUtils = {
    setCookies,
    getCookies,
    clearCookies
}
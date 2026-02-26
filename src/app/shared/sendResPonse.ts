import { Response } from "express";

interface IResPonseData<T> {
    httpStatus: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages?: number;
    }
   
}
const sendResponse = <T>(res: Response, data: IResPonseData<T>) => {
    const {httpStatus, success, message, data: responseData ,meta} = data;
    res.status(httpStatus).json({
        success,
        message,
        data: responseData,
        meta
    })
    
}
export default sendResponse;
import { Response } from "express";

interface IResPonseData<T> {
    httpStatus: number;
    success: boolean;
    message: string;
    data?: T;
   
}
const sendResponse = <T>(res: Response, data: IResPonseData<T>) => {
    const {httpStatus, success, message, data: responseData} = data;
    res.status(httpStatus).json({
        success,
        message,
        data: responseData
    })
    
}
export default sendResponse;
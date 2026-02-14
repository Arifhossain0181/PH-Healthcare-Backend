
import { Request, Response, NextFunction, RequestHandler } from "express";


const catchAsync = (fn: RequestHandler)=>{
    return async (req: Request ,res: Response ,next:NextFunction) => {
        try{
            await fn(req,res,next)
        }
        catch(error ){
            console.log(error)
            res.status(500).json({
                success: false,
                message: "An failed speciality operation",
                error: error instanceof Error ? error.message : "An unknown error occurred"
            })
        }
    }
}
export default catchAsync;

import { Request, Response, NextFunction } from "express";
import z from "zod";

const validation = (zodSchema :z.ZodObject) => 
  {
     return (req:Request, res:Response, next:NextFunction) => {
   const parseResult = zodSchema.safeParse(req.body);
    if(!parseResult.success){
        next(parseResult.error);
    }
    //sanitized and validated data is in parseResult.data
      req.body = parseResult.data;
      next();
     }
}
export default validation;
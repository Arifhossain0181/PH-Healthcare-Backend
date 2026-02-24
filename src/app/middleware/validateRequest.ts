
import { Request, Response, NextFunction } from "express";
import z from "zod";

const validation = (zodSchema :z.ZodObject) => 
  {
     return (req:Request, res:Response, next:NextFunction) => {
      if(req.body.data){
        req.body = JSON.parse(req.body.data);
      }
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
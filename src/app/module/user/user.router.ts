import {  Router } from "express";
import { UserController } from "./user.controller";
import { DoctorController } from "../doctor/doctor.controller";

import { createDoctorZod } from "./user.validation";
import validation from "../../middleware/validateRequest";
import { updateDoctorZod } from "../doctor/doctor.validation";

const router = Router();




router.post(
  "/create-doctor",
  // (req: Request, res: Response, next: NextFunction) =>
    //    {
    //   const parseResult = createDoctorZod.safeParse(req.body);
    //   if(!parseResult.success){
    //       next(parseResult.error);
        
    //   }
    //   //sanitized and validated data is in parseResult.data
    //       req.body = parseResult.data;
    //       next();
    // },
  validation(createDoctorZod),
  UserController.createDoctor,
);
router.get("/getAlldoctors", DoctorController.getAllDoctors);
router.get("/getDoctor/:id", DoctorController.getDoctorById);
router.patch("/updateDoctor/:id", validation(updateDoctorZod),  DoctorController.updateDoctor);
router.delete("/deleteDoctor/:id", DoctorController.deleleteDoctor);

export default router;

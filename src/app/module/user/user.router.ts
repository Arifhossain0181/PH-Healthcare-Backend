import { NextFunction, Router } from "express";
import { UserController } from "./user.controller";
import { DoctorController } from "../doctor/doctor.controller";
import { Request, Response } from "express";
import z from "zod";

const createDoctorZod = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be less than 100 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(5, "Name must be at least 5 characters long")
      .max(30, "Name must be less than 100 characters long"),

    email: z.email("Invalid email format"),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 characters long").max(15, "Contact number must be less than 15 characters long"),
    address: z.string().min(5, "Address must be at least 5 characters long").max(100, "Address must be less than 100 characters long").optional(),
    specialization: z.string().optional(),
    experience: z.number().nonnegative("Experience must be a non-negative number").optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    registationNumber: z.string().optional(),
    appointmentFee: z.number().nonnegative("Appointment fee must be a non-negative number").optional(),
    qualifications: z.string().min(5, "Qualifications must be at least 5 characters long").max(100, "Qualifications must be less than 100 characters long").optional(),
    curreentWorkingPlace: z.string().min(5, "Current working place must be at least 5 characters long").max(100, "Current working place must be less than 100 characters long").optional(),
    designation: z.string().min(5, "Designation must be at least 5 characters long").max(100, "Designation must be less than 100 characters long").optional(),

  }),
  specialties:(z.array(z.string()).min(1, "At least one specialty is required")),
});

const router = Router();

router.post(
  "/create-doctor",
  (req: Request, res: Response, next: NextFunction) => {
    const parseResult = createDoctorZod.safeParse(req.body);
    if(!parseResult.success){
        next(parseResult.error);
       
    }
    //sanitized and validated data is in parseResult.data
        req.body = parseResult.data;
        next();
  },
  UserController.createDoctor,
);
router.get("/getAlldoctors", DoctorController.getAllDoctors);
router.get("/getDoctor/:id", DoctorController.getDoctorById);
router.patch("/updateDoctor/:id", DoctorController.updateDoctor);
router.delete("/deleteDoctor/:id", DoctorController.deleleteDoctor);

export default router;

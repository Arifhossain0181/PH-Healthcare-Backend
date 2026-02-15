import { Router } from "express";
import { DoctorController } from "./doctor.controller";


const router = Router()

router.get("/getAlldoctors", DoctorController.getAllDoctors)
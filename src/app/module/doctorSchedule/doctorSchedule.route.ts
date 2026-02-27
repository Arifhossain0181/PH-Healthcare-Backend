import { Router } from "express";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";
 import {doctorScheduleController} from "./doctorSchedule.controller";
const router = Router();

router.post("/create-my-doctor-schedule",
    checkAuth([Role.DOCTOR]),
     doctorScheduleController.createDoctorSchedule);
router.get("/my-doctor-schedules", checkAuth([Role.DOCTOR]), doctorScheduleController.getMyAllSchedules);
router.get("/", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), doctorScheduleController.getAllSchedules);
router.get("/:doctorId/schedule/:scheduleId", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), doctorScheduleController.getdoctorScheduleById);
router.patch("/update-my-doctor-schedule",
    checkAuth([Role.DOCTOR]),
    doctorScheduleController.uPdateDoctorSchedule);
router.delete("/delete-my-doctor-schedule/:id", checkAuth([Role.DOCTOR]), doctorScheduleController.deleteDoctorSchedule);

export const DoctorScheduleRoutes = router;
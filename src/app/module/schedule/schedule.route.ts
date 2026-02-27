import { Router } from "express";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";
import { scheduleController } from "./schedule.controller";
import { createzodschema, updatezodschema } from "./schedule.validation";
import validateRequest from "../../middleware/validateRequest";
const router = Router()

router.post("/",checkAuth([Role.ADMIN,Role.SUPER_ADMIN]),validateRequest(createzodschema) , scheduleController.createschedule)




router.get("/",checkAuth([Role.ADMIN,Role.SUPER_ADMIN,Role.DOCTOR]))
router.get("/:id",checkAuth([Role.ADMIN,Role.SUPER_ADMIN,Role.DOCTOR]) ,scheduleController.getSingleSchedule)
router.patch("/:id",checkAuth([Role.ADMIN,Role.SUPER_ADMIN]),validateRequest( updatezodschema), scheduleController.updateSchedule) 
router.delete("/:id",checkAuth([Role.ADMIN,Role.SUPER_ADMIN]), scheduleController.deleteSchedule)

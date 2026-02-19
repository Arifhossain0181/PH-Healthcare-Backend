import { Router } from "express";
import { specialityController } from "./sPecility.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";

const router = Router();
router.post("/", specialityController.createSpeciality);
router.get("/",checkAuth([Role.ADMIN, Role.SUPER_ADMIN ,Role.DOCTOR]), specialityController.getAllSpeciality);
router.delete("/:id",checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), specialityController.deleteSpeciality);
router.patch("/:id", specialityController.uPdateSpeciality);

export default router;


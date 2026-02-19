import { Router } from "express";
import { UserController } from "./user.controller";
import { DoctorController } from "../doctor/doctor.controller";

import { createDoctorZod, createAdminZod, createSuperAdminZod } from "./user.validation";
import validation from "../../middleware/validateRequest";
import { updateDoctorZod } from "../doctor/doctor.validation";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";

const router = Router();

// Create Admin - Super Admin only
router.post(
  "/create-admin",
  checkAuth([Role.SUPER_ADMIN]),
  validation(createAdminZod),
  UserController.createAdmin
);

// Create Super Admin - Super Admin only
router.post(
  "/create-super-admin",
  checkAuth([Role.SUPER_ADMIN]),
  validation(createSuperAdminZod),
  UserController.createSuperAdmin
);

// Create Doctor - Admin and SuperAdmin only
router.post(
  "/create-doctor",
  checkAuth([Role.ADMIN, Role.SUPER_ADMIN]),
  validation(createDoctorZod),
  UserController.createDoctor
);

// Doctor routes - Admin and SuperAdmin only
router.get("/doctors", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), DoctorController.getAllDoctors);
router.get("/doctors/:id", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), DoctorController.getDoctorById);
router.patch("/doctors/:id", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), validation(updateDoctorZod), DoctorController.updateDoctor);
router.delete("/doctors/:id", checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), DoctorController.softDeleteDoctor);

export default router;

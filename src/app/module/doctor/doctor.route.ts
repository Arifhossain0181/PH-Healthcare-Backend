import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";

const router = Router();

// Get all doctors - Admin and SuperAdmin only
router.get(
  "/",
  checkAuth([Role.ADMIN, Role.SUPER_ADMIN]),
  DoctorController.getAllDoctors
);

// Get doctor by ID - Admin and SuperAdmin only
router.get(
  "/:id",
  checkAuth([Role.ADMIN, Role.SUPER_ADMIN]),
  DoctorController.getDoctorById
);

// Update doctor - Admin and SuperAdmin only
router.patch(
  "/:id",
  checkAuth([Role.ADMIN, Role.SUPER_ADMIN]),
  DoctorController.updateDoctor
);

// Soft delete doctor - Admin and SuperAdmin only
router.delete(
  "/:id",
  checkAuth([Role.ADMIN, Role.SUPER_ADMIN]),
  DoctorController.softDeleteDoctor
);

export const doctorRoute = router;
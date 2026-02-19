import { Router } from "express";
import { superAdminController } from "./superAdmin.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";

const router = Router();

// Get all super admins - Super Admin only
router.get(
  "/",
  checkAuth([Role.SUPER_ADMIN]),
  superAdminController.getAllSuperAdmins
);

// Get super admin by ID - Super Admin only
router.get(
  "/:id",
  checkAuth([Role.SUPER_ADMIN]),
  superAdminController.getSuperAdminById
);

// Update super admin - Super Admin only
router.patch(
  "/:id",
  checkAuth([Role.SUPER_ADMIN]),
  superAdminController.updateSuperAdmin
);

// Soft delete super admin - Super Admin only
router.delete(
  "/:id",
  checkAuth([Role.SUPER_ADMIN]),
  superAdminController.deleteSuperAdmin
);

export const superAdminRoute = router;

import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";

const router = Router();

// Get all admins - Super Admin only
router.get(
  "/",
  checkAuth([Role.SUPER_ADMIN ,Role.ADMIN]),
  adminController.getAllAdmins
);

// Get admin by ID - Super Admin only
router.get(
  "/:id",
  checkAuth([Role.SUPER_ADMIN ,Role.ADMIN]),
  adminController.getAdminById
);

// Update admin - Super Admin only
router.patch(
  "/:id",
  checkAuth([Role.SUPER_ADMIN]),
  adminController.updateAdmin
);

// Soft delete admin - Super Admin only
router.delete(
  "/:id",
  checkAuth([Role.SUPER_ADMIN]),
  adminController.deleteAdmin
);

export const adminRoute = router;

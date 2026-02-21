import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";


const router = Router()
router.post("/register",authController.register)
router.post("/login",authController.login)
router.get("/me",checkAuth([Role.PATIENT ,Role.SUPER_ADMIN ,Role.DOCTOR ,Role.ADMIN]),authController.getMe)
router.post("/refresh-token",authController.getnewtoken)
router.post("/change-password",checkAuth([Role.PATIENT ,Role.SUPER_ADMIN ,Role.DOCTOR ,Role.ADMIN]),authController.changePassword)
router.post("/logout",checkAuth([Role.PATIENT ,Role.SUPER_ADMIN ,Role.DOCTOR ,Role.ADMIN]),authController.logout)

export default router 

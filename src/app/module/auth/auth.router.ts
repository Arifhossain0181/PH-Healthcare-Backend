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
router.post("/verify-email",authController.verifyEmail)
router.post("/forget-password",authController.forgetPassword);
router.post("/reset-password",authController.restPasword)


router.get("/login/google",authController.googleLogin)
router.get("/google/success",authController.googleLoginsuccess)

router.get("/oauth/error",authController.oauthError)



export default router 

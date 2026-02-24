import { Router } from "express";
import { specialityController } from "./sPecility.controller";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "../../../../prisma/generated/prisma";
import { multerConfig } from "../../config/cloudinary/multer.config";
import validation from "../../middleware/validateRequest";
import { specialityValidation } from "./sPecility.validation";

const router = Router();
router.post("/",checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), multerConfig.single("file"),validation(specialityValidation.createSpecialityZodSchema), specialityController.createSpeciality);
router.get("/",checkAuth([Role.ADMIN, Role.SUPER_ADMIN ,Role.DOCTOR]), specialityController.getAllSpeciality);
router.delete("/:id",checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), specialityController.deleteSpeciality);
router.patch("/:id", specialityController.uPdateSpeciality);

export default router;


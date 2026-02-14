import { Router } from "express";
import { specialityController } from "./sPecility.controller";

const router = Router();
router.post("/", specialityController.createSpeciality);
router.get("/", specialityController.getAllSpeciality);
router.delete("/:id", specialityController.deleteSpeciality);
router.patch("/:id", specialityController.uPdateSpeciality);

export default router;


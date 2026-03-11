import { Role } from "../../../../prisma/generated/prisma";
import { checkAuth } from "../../middleware/checkauth";
import express from "express";
import { StatsController } from "./stats.controller";


const router = express.Router();

router.get(
	"/",
	checkAuth([Role.DOCTOR, Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN]),
	StatsController.getdashboardstatsdata
);

export const StatsRoutes = router;
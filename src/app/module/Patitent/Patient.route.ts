import { NextFunction, Router } from "express";
import { checkAuth } from "../../middleware/checkauth";
import { Role } from "@prisma/client";
import { PatientController } from "./Patient.controller";
import validation from "../../middleware/validateRequest";
import { PatientValidation } from "./Patient.validation";
import { multerConfig } from "../../config/cloudinary/multer.config";
import { Request, Response } from "express";
import { IUpdatePatientInfoPayload, IUUpdatePatientProfilePayload } from "./Patient.interface";
const router = Router()

router.patch(
    "/update-my-profile",
    checkAuth([Role.PATIENT]),
    multerConfig.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "medicalReports", maxCount: 10 },
    ]),
    (req: Request, res: Response, next: NextFunction) => {
        const payload: IUUpdatePatientProfilePayload = req.body as IUUpdatePatientProfilePayload;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] | undefined };

        if (files?.profilePhoto?.[0]) {
            if (!payload.patientInfo) payload.patientInfo = {} as IUpdatePatientInfoPayload;
            payload.patientInfo.profilePhoto = files.profilePhoto[0].path;
        }

        if (files?.medicalReports && files.medicalReports.length > 0) {
            const newRePorts = files.medicalReports.map((file) => ({
                reportLink: file.path,
                reportName: file.originalname || `Medical Report - ${new Date().toISOString()}`,
            }));

            if (payload.medicalReports && Array.isArray(payload.medicalReports)) {
                payload.medicalReports = [...payload.medicalReports, ...newRePorts];
            } else {
                payload.medicalReports = newRePorts;
            }

            payload.reportInfo = payload.reportInfo ? [...payload.reportInfo, ...newRePorts] : newRePorts;
        }

        req.body = payload;
        next();
    },
    validation(PatientValidation.updatePatientProfileZodSchema),
    PatientController.updateMyProfile
);

export const PatientRoute = router;
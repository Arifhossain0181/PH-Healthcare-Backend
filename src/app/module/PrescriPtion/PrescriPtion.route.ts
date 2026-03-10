
import express from 'express';
import { PrescriptionController } from './PrescriPtion.controller';
import { PrescriptionValidation } from './PrescriPtion.validation';
import { Role } from '../../../../prisma/generated/prisma';
import { checkAuth } from '../../middleware/checkauth';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.get(
    '/',
    checkAuth([Role.SUPER_ADMIN, Role.ADMIN]),
    PrescriptionController.getAllPrescriptions
);

router.get(
    '/my-prescriptions',
    checkAuth([Role.PATIENT, Role.DOCTOR]),
    PrescriptionController.myPrescriptions
)

router.post(
    '/',
    checkAuth([Role.DOCTOR]),
    validateRequest(PrescriptionValidation.createPrescriptionZodSchema),
    PrescriptionController.givePrescription
)

router.patch(
    '/:id',
    checkAuth([Role.DOCTOR] ),
    validateRequest(PrescriptionValidation.updatePrescriptionZodSchema),
    PrescriptionController.updatePrescription
)

router.delete(
    '/:id',
    checkAuth([Role.DOCTOR]), 
    PrescriptionController.deletePrescription
)


export const PrescriptionRoutes = router;

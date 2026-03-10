import express from 'express';

import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
import { Role } from '../../../../prisma/generated/prisma';
import { checkAuth } from '../../middleware/checkauth';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.get('/', ReviewController.getAllreview);

router.post(
    '/',
    checkAuth([Role.PATIENT]),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.giveReview
);

router.get('/my-reviews', checkAuth([Role.PATIENT, Role.DOCTOR]), ReviewController.myReview);

router.patch('/:id', checkAuth([Role.PATIENT]), validateRequest(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);

router.delete('/:id', checkAuth([Role.PATIENT]), ReviewController.deleteReview);



    
export const ReviewRoutes = router;
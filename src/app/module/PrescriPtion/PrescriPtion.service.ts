import { PaymentStatus } from "../../../../prisma/generated/prisma";
import { IRequest } from "../../interface/request.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "../review/review.interface";


const giveReview = async (user: IRequest, payload: ICreateReviewPayload) => {
    const Patientdata = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
        },
    });

    if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
        throw new Error("You can only review after payment");
    }
    if(appointmentData.patientId !== Patientdata.id) {
        throw new Error("You can only review your own appointments");
    }
    const isReview = await prisma.review.findFirst({
        where: {
            appointmentId: payload.appointmentId,
        },
    })
    if(isReview) {
        throw new Error("You have already reviewed this appointment");
    }
   const result = await prisma.$transaction(async(tx) =>{
    const review = await tx.review.create({
        data:{
           ...payload,
              patientId: Patientdata.id,
              doctorId: appointmentData.doctorId,
        }
    })
    const averageRating =await tx.review.aggregate({
        _avg:{
            rating: true,}
    }) || { _avg: { rating: 0 } };
    await tx.doctor.update({
        where: {
            id: appointmentData.doctorId,
        },
        data: {
            averageRating: averageRating._avg.rating,
        }
      
    })
      return review;
   })
   return result;
};

export const PrescriPtionService = {
    giveReview,
};
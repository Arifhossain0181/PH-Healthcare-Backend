import { PaymentStatus, Role } from "../../../../prisma/generated/prisma";
import { IRequest } from "../../interface/request.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "../review/review.interface";


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
const getallReview = async () => {
    const reviews = await prisma.review.findMany({
         include:{
            doctor :true,
            patient: true,
            appointment: true,
         }
    })
    return reviews;
}
const myReview = async (user: IRequest) => {
    const userRecord = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (!userRecord) throw new Error("User not found");

    if (userRecord.role === Role.DOCTOR) {
        const doctodata= await prisma.doctor.findUniqueOrThrow({
            where: {
                email: user.email,
            },
        })
        return await prisma.review.findMany({
            where: {
                doctorId: doctodata.id
            },
            include:{
                patient: true,
                appointment: true,
            }
         })
    }  
    if (userRecord.role === Role.PATIENT) {
        const patientdata= await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email,
            },
        })
        return await prisma.review.findMany({
            where: {
                patientId: patientdata.id
            },
            include:{
                doctor: true,
                appointment: true,}
        })
    } 
}
const updateReview = async ( user : IRequest ,reviewId:string, payload: IUpdateReviewPayload) => {
    const Patientdata = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,  
        },
    });
    const reviewData = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId,
        },
    });
    if(reviewData.patientId !== Patientdata.id) {
        throw new Error("You can only update your own reviews");
    }
    const result = await prisma.$transaction(async(tx) =>{
        const UPdate = await tx.review.update({
            where: {
                id: reviewId,
            },
            data: {
                ...payload,
            }
        })
        const averageRating =await tx.review.aggregate({
            where :{
                doctorId: reviewData.doctorId,
            },
            _avg:{
                rating: true,
            }
        })
        await tx.doctor.update({
            where: {
                id: reviewData.doctorId,
            },
            data: {
                averageRating: averageRating._avg.rating,
            }
        })
        return UPdate;
    }
    )
    return result;
}
const deleteReview = async (user: IRequest, reviewId: string) => {
    const Patientdata = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const reviewData = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId,
        },

    });
    if (reviewData.patientId !== Patientdata.id) {
        throw new Error("You can only delete your own reviews");
    }
    const result = await prisma.$transaction(async (tx) =>{
        const deleteReview = await tx.review.delete({
            where: {
                id: reviewId,
            },
        })
        const averageRating =await tx.review.aggregate({
            where :{
                doctorId: reviewData.doctorId,
            },  
            _avg:{
                rating: true,
            }
        

    })
        await tx.doctor.update({
            where: {
                id: reviewData.doctorId,
            },
            data: {
                averageRating: averageRating._avg.rating,
            }
        })
        return deleteReview;
    })
    return result;
}
       

export const PrescriPtionService = {
    giveReview,
    getallReview,
    myReview,
    updateReview,
    deleteReview,
};
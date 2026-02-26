import { Prisma } from "../../../../prisma/generated/prisma";


export const doctorSearchableFields = ['user.name', 'user.email', 'currentWorkingPlace', 'designation' ,'specialties.specialty',"qualification","experience","averageRating" ,"designation"];

export const doctorfilterableFields = ['user.name', 'user.email', 'currentWorkingPlace', 'designation' ,'specialties.specialty',"qualification","experience","averageRating" ,"designation" ,'gender', 'registrationNumber','appointmentFee' ,"specialties.specialty.title", "isDeleted"];

export const doctorIncludeConfig : Partial<Record<keyof Prisma.DoctorInclude,Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specialties: {
        include: {
            doctor: true,
            specialty: true,
        }
    },
    doctorSchedules: {
        include: {
            schedule: true,
        }
    },
    prescriptions: true,
    reviews: true,
}


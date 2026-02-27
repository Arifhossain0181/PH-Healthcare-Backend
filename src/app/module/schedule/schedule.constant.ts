import { Prisma } from "../../../../prisma/generated/prisma"

export const schedulefileterabledields =[
    'id',
    'startDateTime',
    'endDateTime',
    'createdAt',
    'updatedAt'

]
export const schedulesearchablefields = [
    'id',
    'startDateTime',
    'endDateTime',

]
export const scheduleIncludeconfig : Partial<Record<keyof Prisma.ScheduleInclude ,Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]>> = {
    doctorSchedules: {
        include: {
            appointment: {
                include: {
                    patient: true,
                    doctor: true,
                    prescription: true,
                    payment: true,
                    review: true,
                }
            },
            doctor: true
        }
    },
}
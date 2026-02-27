import { ICreateschedulePayload, IQueryParams, IUpdateSchedulePayload } from "./schedule.interface";
import { addHours, addMinutes, format } from "date-fns";
import { converdatetime } from "./schedule.utls";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../ulitis/QueryBuilder";
import { schedulefileterabledields, scheduleIncludeconfig, schedulesearchablefields } from "./schedule.constant";
import { Prisma, Schedule } from "../../../../prisma/generated/prisma";



const createschedules = async( payload: ICreateschedulePayload) =>{
    const {startDate, endDate, startTime, endTime} = payload; 

    const interval = 30;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const schedules = [];

    while (currentDate <= lastDate) {
        const stratdatetime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]),
                ),
                Number(startTime.split(":")[1])
            )
        );
        const enddatetime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]),
                ),
                Number(endTime.split(":")[1])
            )
        );
        while( stratdatetime < enddatetime){
            const s =await converdatetime(stratdatetime);
            const e = await converdatetime(addMinutes(stratdatetime, interval));
            const schedule = {
                startDateTime: s,
                endDateTime: e
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: schedule.startDateTime,
                    endDateTime: schedule.endDateTime,
                }
            })

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: schedule
                })
                schedules.push(result);
            }
   
            stratdatetime.setMinutes(stratdatetime.getMinutes() + interval);
        }
         currentDate.setDate(currentDate.getDate() + 1);


    }
    return schedules;

}

const getAllSchedules = async(query: IQueryParams) => {
        const  querybuilder = new QueryBuilder<Schedule, Prisma.ScheduleWhereInput ,Prisma.ScheduleInclude>(prisma.schedule, query, {
            searchableFields: schedulesearchablefields,
            filterableFields: schedulefileterabledields,
    })
    const result = await querybuilder.search().filter().paginate().sort().dynamicInclude(scheduleIncludeconfig).fields().exec()

    return result;

}
const getSingleSchedule = async(id : string) => {
    const schedule = await prisma.schedule.findUnique({
        where: {id},
    })
    return schedule;
}
const updateSchedule = async(id : string, payload : IUpdateSchedulePayload) => {
    const {startDate, endDate, startTime, endTime} = payload;

    const startDateTime = new Date(
        addMinutes(
            addHours(
                `${format(new Date(startDate), "yyyy-MM-dd")}`,
                Number(startTime.split(":")[0]),
            ),
            Number(startTime.split(":")[1])
        )
    );
    const endDateTime = new Date(
        addMinutes(
            addHours(
                `${format(new Date(endDate), "yyyy-MM-dd")}`,
                Number(endTime.split(":")[0]),
            ),
            Number(endTime.split(":")[1])
        )
    );

    const updatedSchedule = await prisma.schedule.update({
        where: { id },
        data: {
            startDateTime,
            endDateTime
        }
    });

    return updatedSchedule;
}
const deleteSchedule = async(id : string) => {
    const schedule = await prisma.schedule.delete({
        where: {id}
    })
    return schedule;
}


export const scheduleService = {
    createschedules,
    getAllSchedules,
    getSingleSchedule,
    updateSchedule,
    deleteSchedule
};
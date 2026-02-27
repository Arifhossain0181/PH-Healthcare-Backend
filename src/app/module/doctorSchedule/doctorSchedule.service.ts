import { DoctorSchedules, Prisma } from "../../../../prisma/generated/prisma";
import { IRequest } from "../../interface/request.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../ulitis/QueryBuilder";
import { doctorIncludeConfig, doctorSearchableFields } from "../doctor/doctor.const";
import { IQueryParams } from "../schedule/schedule.interface";
import { doctorScheduleFilterableFields, doctorScheduleSearchableFields } from "./doctor.constant";
import { IDoctorschedule, IUPDateoctorschedule } from "./doctorschedule.interface";

const createdoctorSchedule = async (user: IRequest, payload: IDoctorschedule) => {
    const doctordata = await prisma.doctor.findUnique({
        where: { email: user.email }

    })
    if (!doctordata || !doctordata.id) {
        throw new Error("Authenticated doctor not found");
    }
    const doctorSchedule = payload.scheduleId.map((scheduleId) => ({
        doctorId: doctordata.id,
        scheduleId: scheduleId,
    }))
    const result = await prisma.doctorSchedules.createMany({
        data: doctorSchedule,
    })
    return result;


}


const getMyAllSchedules = async (query: IQueryParams ,user: IRequest) => {
    const doctordata = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const params = { ...(query || {}), doctorId: doctordata.id } as IQueryParams;
    const querybuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(
        prisma.doctorSchedules,
        params,
        {
            filterableFields: doctorScheduleFilterableFields,
            searchableFields: doctorSearchableFields,
        }
    );

    const doctorschedules = await querybuilder
        .search()
        .filter()
        .paginate()
        .include({ schedule: true, doctor: true })
        .sort()
        .fields()
        .dynamicInclude(doctorIncludeConfig)
        .exec();
return doctorschedules;
}
const getAllSchedules = async(query: IQueryParams) => {
const querybuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(
    prisma.doctorSchedules,query,{
        filterableFields: doctorScheduleFilterableFields,
        searchableFields: doctorScheduleSearchableFields,
    })
    const schedules = await querybuilder
    .search()
    .filter()
    .paginate()
    .include({ schedule: true, doctor: true })
    .sort()
    .fields()
    .dynamicInclude(doctorIncludeConfig)
    .exec();
    return schedules;
}
const getdoctorScheduleById = async(id : string) => {
    const doctorschedule = await prisma.doctorSchedules.findUnique({
        where:{
            doctorId_scheduleId : {
                doctorId : id,
                scheduleId : id
            }
        },
        include:{
            schedule: true,
            doctor: true
        }
    })
        return doctorschedule;
}

const  uPdateDoctorSchedule = async ( user: IRequest, payload: IUPDateoctorschedule | IDoctorschedule) => {
    const doctordata = await prisma.doctor.findUniqueOrThrow({
         where :{
            email : user.email
         }
    })
    // normalize payload.scheduleId which can be either string[] (IDoctorschedule)
    // or an object with shoulddelete/shouldadd/id (IUPDateoctorschedule)
    const scheduleField = (payload ).scheduleId;
    let deleteIds: string[] = [];
    let createIds: string[] = [];

    if (Array.isArray(scheduleField)) {
        createIds = scheduleField as string[];
    } else if (scheduleField && typeof scheduleField === 'object') {
        if (Array.isArray(scheduleField.shoulddelete) || Array.isArray(scheduleField.shouldadd)) {
            deleteIds = scheduleField.shoulddelete ?? [];
            createIds = scheduleField.shouldadd ?? [];
        } else if (typeof scheduleField.id === 'string') {
            createIds = [scheduleField.id];
        }
    }

    const result = await prisma.$transaction(async (tx) => {
        if (deleteIds.length) {
            await tx.doctorSchedules.deleteMany({
                where: {
                    doctorId: doctordata.id,
                    scheduleId: { in: deleteIds },
                },
            });
        }

        if (createIds.length) {
            const doctorscheduledata = createIds.map((scheduleId) => ({
                doctorId: doctordata.id,
                scheduleId,
            }));
            const createResult = await tx.doctorSchedules.createMany({ data: doctorscheduledata });
            return createResult;
        }

        return { count: 0 } as { count: number };
    });

    return result;
    }


    const deleteDoctorSchedule = async(id : string, user: IRequest) => {
        const doctordata = await prisma.doctor.findUniqueOrThrow({
                where :{
                    email : user.email
                }
        })
        const result = await prisma.doctorSchedules.deleteMany({
            where: {
                 isBooked : false,
                doctorId: doctordata.id,
                scheduleId: id
            },
        });
         return result;
    }




export const doctorScheduleService = {
    createdoctorSchedule,
    uPdateDoctorSchedule,
    getMyAllSchedules,  
    getAllSchedules,
    deleteDoctorSchedule,
    getdoctorScheduleById
}
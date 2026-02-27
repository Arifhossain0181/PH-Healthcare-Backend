

export interface IDoctorschedule {
    doctorId : string;
    scheduleId : string[]
}

export interface IUPDateoctorschedule {
    doctorId : string;
    scheduleId : {
        shoulddelete : string[]
        shouldadd : string[]
        id : string
    }
}

export interface IBookAppointment {
    doctorId: string;
    scheduleId: string;
    symptoms: string;
}

export interface IUPdateAppointment {
    doctorId?: string;
    scheduleId?: string;
    symptoms?: string;
    status?: string;
}
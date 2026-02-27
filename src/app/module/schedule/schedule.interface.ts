
export interface ICreateschedulePayload {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
}

export interface IQueryParams {
        page?: string
        limit?: string
        sortBy?: string
        sortOrder?: "asc" | "desc"
        filters?: {
            [key: string]: string | number | boolean
        }
        [key: string]: unknown
}

export interface IUpdateSchedulePayload {
    startDate : string;
    endDate : string;
    startTime : string;
    endTime : string;
}
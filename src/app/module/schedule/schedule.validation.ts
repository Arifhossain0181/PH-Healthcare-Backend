import { z } from "zod";

export const createzodschema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected a valid date string.",

    }
    ),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected a valid date string.",}
    ),
    startTime: z.string().refine((time) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected HH:mm format.",
    }),
    endTime: z.string().refine((time) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected HH:mm format.",
    }),

})

export const updatezodschema = z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected a valid date string.",}
    ).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format. Expected a valid date string.",}
    ).optional(),
    startTime: z.string().refine((time) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected HH:mm format.",
    }).optional(),
    endTime: z.string().refine((time) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(time), {
        message: "Invalid time format. Expected HH:mm format.",
    }).optional(),
    

})
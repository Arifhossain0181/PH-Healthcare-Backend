import { z } from "zod";

const  updatePatientProfileZodSchema = z.object({
    patientInfo: z.object({
        name:z.string("name is required").min(3,"name must be at least 3 characters long").max(100,"name must be less than 100 characters long").optional(),
        profilePhoto: z.string("profile is required").optional(),
        contactNumber: z.string("contact number is required").min(10,"contact number must be at least 10 characters long").max(15,"contact number must be less than 15 characters long").optional(),
        address: z.string("address is required").min(5,"address must be at least 5 characters long").max(200,"address must be less than 200 characters long").optional(),
    }).optional(),
    healthInfo: z.object({
        gender: z.enum(["Male", "Female", "Other"],"gender is required").optional(),
        dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "date of birth must be a valid date" }).optional(),
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],"blood group is required").optional(),
        hasAllergies: z.boolean("has allergies is required").optional(),
        hasDiabetes: z.boolean("has diabetes is required").optional(),
        height: z.string("height is required").optional(),
        weight: z.string("weight is required").optional(),
        smokingStatus: z.boolean("smoking status is required").optional(),
        dietaryPreferences: z.string("dietary preferences is required").optional(),
        pregnancyStatus: z.boolean("pregnancy status is required").optional(),
        mentalHealthHistory: z.string("mental health history is required").optional(),
        immunizationStatus: z.string("immunization status is required").optional(),
        hasPastSurgeries: z.boolean("has past surgeries is required").optional(),
        recentAnxiety: z.boolean("recent anxiety is required").optional(),
        recentDepression: z.boolean("recent depression is required").optional(),
        maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"],"marital status is required").optional(),


    }).optional(),
    reportInfo: z.array(z.object({
        shouldDelete: z.boolean().optional(),
        reportId: z.string().uuid().optional(),
        reportName: z.string().min(3,"report name must be at least 3 characters long").max(100,"report name must be less than 100 characters long").optional(),
        reportLink: z.string().url("report link must be a valid url").optional(),
    })).optional().refine((reports) =>{
        if(!reports || reports.length === 0) return true; // if reports are not provided or empty, it's valid
        for(const report of reports){
            if(report.shouldDelete && !report.reportId){
                return false; // if shouldDelete is true, reportId must be provided
            }
            if(report.reportId && !report.shouldDelete){
                return false; // if reportId is provided, shouldDelete must be true
            }
            if((report.reportLink && !report.reportName) || (report.reportName && !report.reportLink)){
                return false; // reportLink and reportName must come together
            }
            if(report.reportLink && !report.reportName){
                return false; // if reportLink is provided, reportName must be provided
            } 
            
        }
        return true;
    }, { message: 'Invalid reportInfo' })
});

export const PatientValidation = {
    updatePatientProfileZodSchema
}
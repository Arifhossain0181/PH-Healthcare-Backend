import { BloodGroup, Gender, MaritalStatus } from "../../../../prisma/generated/prisma";

export interface IUpdatePatientInfoPayload {
    name: string;
    profilePhoto?: string;
    contactNumber: string;
    address: string;
}

export interface IUpdateHealthInfoPayload {
  gender: Gender;
  dateOfBirth: Date;
  bloodGroup: BloodGroup;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height: string;
  weight: string;
  smokingStatus: boolean;
  dietaryPreferences: string;
  pregnancyStatus: boolean;
  mentalHealthHistory: string;
  immunizationStatus: string;
  hasPastSurgeries: boolean;
  recentAnxiety: boolean;
  recentDepression: boolean;
  maritalStatus: MaritalStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUpdatePatientInfoReportPayload {
    reportName?: string;
    reportLink?: string;
    shouldDelete?: boolean;
    reportId?: string;
    // optional fields to match MedicalReport model
    doctorId?: string;
    appointmentId?: string;
    diagnosis?: string;
    treatment?: string;
    followUpDate?: string | Date;
}

export  interface IUUpdatePatientProfilePayload{
    patientInfo?: IUpdatePatientInfoPayload;
    // keep legacy name used across services
    patientHealthData?: IUpdateHealthInfoPayload;
    // support both names
    healthInfo?: IUpdateHealthInfoPayload;
    medicalReports?: IUpdatePatientInfoReportPayload[];
    reportInfo?: IUpdatePatientInfoReportPayload[];
}

// alias to satisfy places expecting different name
export type IUpdatePatientHealthDataPayload = IUpdateHealthInfoPayload;
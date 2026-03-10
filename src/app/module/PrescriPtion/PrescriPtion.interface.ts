export interface ICreatePrescriptionPayload {
    appointmentId: string;
    followUpDate: Date;
    instructions: string;
    medication: string;
    dosage: string;
    dosageUnit: string;
    frequency: string;
    duration: string;
}

export interface IUpdatePrescriptionPayload {
    followUpDate?: Date;
    instructions?: string;
}
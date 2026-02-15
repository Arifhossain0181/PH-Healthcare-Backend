
export interface IUPdateDoctorProfilePayload {
    password?: string;
    doctor?: {
        name?: string;
        email?: string;
        ProfilePhoto?: string;
        profilePhoto?: string; // Allow both cases for flexibility
        contactNumber?: string;
        address?: string;
        specialization?: string;
        experience?: number;
        gender?: string;
        registrationNumber?: string;
        appointmentFee?: number;
        qualifications?: string;
        curreentWorkingPlace?: string;
        designation?: string;
    };
    specialties?: string[];
}
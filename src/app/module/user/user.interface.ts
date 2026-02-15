


// model Doctor {
//   id String @id @default(uuid())

import { Gender } from "../../../../prisma/generated/prisma";

//   name          String
//   email         String    @unique
//   ProfilePhoto  String?
//   contactNumber String?
//   address       String?
//   specialization String?
//   experience     Int@default(0)
//   gender        Gender
//   registrationNumber String? @unique
//   appointmentFee  Float?
//   qualifications String?
//   curreentWorkingPlace String?
//   designation String?
//   averageRating Float? @default(0)
//   isDeleted     Boolean   @default(false)
//   deletedAt     DateTime?
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt

//   // Relations
//   userId String @unique
//   user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

//   specialties DoctorSpecialty[]

//  @@index([email], name: "doctor_email_index")
//     @@index([deletedAt], name: "doctor_deletedAt_index")
//   @@map("doctor")
// }
export interface ICreateDoctorPlayload {
    
    password: string;
    doctor:{
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        specialization?: string;
        experience?: number;
        gender:Gender;
        registrationNumber?: string;
        appointmentFee?: number;
        qualifications?: string;
        curreentWorkingPlace?: string;
        designation?: string;
    },
    specialties: string[];
}
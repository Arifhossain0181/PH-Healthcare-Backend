import { deletefilecloudinary as deleteFileFromCloudinary } from "../../config/cloudinary/cloudinary.config";
import { IRequest } from "../../interface/request.interface";

import { prisma } from "../../lib/prisma";
import {
  IUUpdatePatientProfilePayload,
  IUpdatePatientHealthDataPayload,
  IUpdatePatientInfoPayload,
} from "./Patient.interface";
import { converdatetime } from "./Patient.utilits";

const updateMyProfile = async (
  user: IRequest,
  payload: IUUpdatePatientProfilePayload,
) => {
  // throw new Error("This is an intentional error to test Sentry integration in the backend.");
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      patientHealthData: true,
      medicalReports: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (payload.patientInfo) {
      const patientInfo: IUpdatePatientInfoPayload = payload.patientInfo;

      await tx.patient.update({
        where: {
          id: patientData.id,
        },
        data: {
          ...patientInfo,
        },
      });

      if (patientInfo.name || patientInfo.profilePhoto) {
        const userData = {
          name: patientInfo.name ? patientInfo.name : patientData.name,
          image: patientInfo.profilePhoto
            ? patientInfo.profilePhoto
            : patientData.ProfilePhoto,
        };

        await tx.user.update({
          where: {
            id: patientData.userId,
          },
          data: {
            ...userData,
          },
        });
      }
    }

    if (payload.patientHealthData) {
      const healthDataToSave: IUpdatePatientHealthDataPayload = {
        ...payload.patientHealthData,
      };

      if (payload.patientHealthData.dateOfBirth) {
        healthDataToSave.dateOfBirth = converdatetime(
          typeof healthDataToSave.dateOfBirth === "string"
            ? healthDataToSave.dateOfBirth
            : undefined,
        ) as Date;
      }

      await tx.patientHealthData.upsert({
        where: {
          patientId: patientData.id,
        },
        update: healthDataToSave,
        create: {
          patientId: patientData.id,
          ...healthDataToSave,
        },
      });
    }

    if (
      payload.medicalReports &&
      Array.isArray(payload.medicalReports) &&
      payload.medicalReports.length > 0
    ) {
      for (const report of payload.medicalReports) {
        if (report.shouldDelete && report.reportId) {
          const deletedReport = await tx.medicalReport.delete({
            where: {
              id: report.reportId,
            },
          });

          if (deletedReport.reportLink) {
            await deleteFileFromCloudinary(deletedReport.reportLink);
          }
        } else if (report.reportName && report.reportLink) {
          // require fields that are non-nullable in Prisma schema
          if (
            !report.doctorId ||
            !report.appointmentId ||
            !report.diagnosis ||
            !report.treatment
          ) {
            throw new Error(
              "Missing required medical report fields: doctorId, appointmentId, diagnosis, treatment",
            );
          }

          // normalize followUpDate: allow string or Date in payload
          let followUpDateValue: Date | undefined = undefined;
          if (report.followUpDate) {
            if (typeof report.followUpDate === "string") {
              followUpDateValue = converdatetime(report.followUpDate) as Date;
            } else {
              followUpDateValue = report.followUpDate as Date;
            }
          }

          await tx.medicalReport.create({
            data: {
              patientId: patientData.id,
              reportName: report.reportName,
              reportLink: report.reportLink,
              doctorId: report.doctorId,
              appointmentId: report.appointmentId,
              diagnosis: report.diagnosis,
              treatment: report.treatment,
              followUpDate: followUpDateValue,
            },
          });
        }
      }
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      id: patientData.id,
    },
    include: {
      user: true,
      patientHealthData: true,
      medicalReports: true,
    },
  });

  return result;
};

export const PatientService = {
  updateMyProfile,
};

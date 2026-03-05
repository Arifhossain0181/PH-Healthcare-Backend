import {v7 as uuidv7} from "uuid";
import { IRequest } from "../../interface/request.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointment } from "./appointment.interface";
import {
  AppointmentStatus,
  Role,
  PaymentStatus,
} from "../../../../prisma/generated/prisma";
import { striPe } from "../../config/striPe.config";
import { envVars } from "../../config/env";

// Pay now book appointment flow:
const bookAppointment = async (payload: IBookAppointment, user: IRequest) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctordata = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId,
    },
  });

  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
      },
      isBooked: false,
    },
  });
  const videocallingId = String(uuidv7());

  const result = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        doctorId: doctordata.id,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId: videocallingId,
      },
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctordata.id,
          scheduleId: scheduleData.id,
        },
      },
      data: {
        isBooked: true,
      },
    });
    // todo aPPyment integration here
    const transactionId = String(uuidv7());
    const Paymentdata = await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: Number(doctordata.appointmentFee ?? 0),
        transactionId,
      },
    });
    const session = await striPe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Payment for appointment with Dr. ${doctordata.name}`,
            },
            unit_amount: Number(doctordata.appointmentFee ?? 0) * 120, // amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        paymentId: Paymentdata.id,
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
    });
    return {
      appointment: appointment,
      paymentdata: Paymentdata,
      Paymentuel: session.url,
    };
  });
  return {
    appointment: result.appointment,
    payment: result.paymentdata,
    Paymentuel: result.Paymentuel,
  };
};

const getMyAppointments = async (user: IRequest) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  let appointments;
  if (patientData) {
    appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        schedule: true,
      },
    });
  } else if (doctorData) {
    appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        schedule: true,
      },
    });
  } else {
    throw new Error("User not found");
  }
  return appointments;
};

// 1. Completed Or Cancelled Appointments should not be allowed to update status
// 2. Doctors can only update Appoinment status from schedule to inprogress or inprogress to complted or schedule to cancelled.
// 3. Patients can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress.
// 4. Admin and Super admin can update to any status.

const changeAppointmentStatus = async (
  appointmentId: string,
  appointmentStatus: AppointmentStatus,
  user: IRequest,
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      // status: AppointmentStatus.SCHEDULED
    },
    include: {
      doctor: true,
    },
  });

  // if (!appointmentData) {
  //     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/cancelled");
  // }

  if (user?.role === Role.DOCTOR) {
    if (!(user?.email === appointmentData.doctor.email))
      throw new Error("This is not your appointment");
  }

  return await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: appointmentStatus,
    },
  });
};

// refactoring on include of doctor and patient data in appointment details, we can use query builder to get the data in single query instead of multiple queries in case of doctor and patient both
const getMySingleAppointment = async (
  appointmentId: string,
  user: IRequest,
) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  let appointment;

  if (patientData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patientData.id,
      },
      include: {
        doctor: true,
        schedule: true,
      },
    });
  } else if (doctorData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctorData.id,
      },
      include: {
        patient: true,
        schedule: true,
      },
    });
  }

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};
const getallaPPointement = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
      schedule: true,
    },
  });
  return appointments;
};

const bookAppointmentWithPayLater = async (
  payload: IBookAppointment,
  user: IRequest,
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId,
    },
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id,
      },
    },
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async (tx) => {
    const appointmentCreated = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId,
      },
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });
    const transactionId = String(uuidv7());
    const Paymentdata = await tx.payment.create({
      data: {
        appointmentId: appointmentCreated.id,
        amount: doctorData.appointmentFee ?? 0,
        transactionId,
        status: PaymentStatus.UNPAID,
      },
    });

    return { appointment: appointmentCreated, payment: Paymentdata };
  });

  return {
    appointment: result.appointment,
    payment: result.payment,
  };
};

const initiatePayment = async (appointmentId: string, user: IRequest) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      patientId: patientData.id,
    },
    include: {
      doctor: true,
      payment: true,
    },
  });
  if (!appointmentData) {
    throw new Error("Appointment not found");
  }

  if (!appointmentData.payment) {
    throw new Error("Payment data not found for this appointment");
  }

  if (appointmentData.payment?.status === PaymentStatus.PAID) {
    throw new Error("Payment already completed for this appointment");
  }

  if (appointmentData.status === AppointmentStatus.CANCELED) {
    throw new Error("Appointment is canceled");
  }
  const session = await striPe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Payment for appointment with Dr. ${appointmentData.doctor.name}`,
          },
          unit_amount: Number(appointmentData.doctor.appointmentFee ?? 0) * 120, // amount in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointmentData.id,
      paymentId: appointmentData.payment.id,
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointmentId=${appointmentData.id}&paymentId=${appointmentData.payment.id}`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointment?error=payment_cancelled`,
  });
  return {
    Paymenturl: session.url,
  };
};

const cancelAppointmentUnPaid = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unPaidAppointments = await prisma.appointment.findMany({
        where: {
            status: AppointmentStatus.SCHEDULED,
            createdAt: {
                lte: thirtyMinutesAgo,},
                paymentStatus: PaymentStatus.UNPAID,


        }

    })
    const aPPPointmentsToCancel = unPaidAppointments.map((appointment) => appointment.id);
     await prisma.$transaction(async (tx) => {
        await tx.appointment.updateMany({
            where: {
                id: {
                    in: aPPPointmentsToCancel,}},
            data: {
                status: AppointmentStatus.CANCELED,
            },
        })
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: aPPPointmentsToCancel,}},
           
        })
        for (const unPaidAppointment of unPaidAppointments) {
          await tx.doctorSchedules.update({
            where: {
              doctorId_scheduleId: {
                doctorId: unPaidAppointment.doctorId,
                scheduleId: unPaidAppointment.scheduleId,
              },
            },
            data: {
              isBooked: false,
            },
          });
        }

      });

};

export const AppointmentService = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getallaPPointement,
  getAllAppointments: getallaPPointement,
  cancelAppointmentUnPaid,
  bookAppointmentWithPayLater,
  initiatePayment,
};

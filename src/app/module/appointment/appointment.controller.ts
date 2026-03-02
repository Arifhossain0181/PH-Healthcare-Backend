import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await AppointmentService.bookAppointment(payload, user);
  res.status(201).json({ success: true, message: "Appointment booked successfully", data: result });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const appointments = await AppointmentService.getMyAppointments(user);
  res.status(200).json({ success: true, message: "Appointments retrieved successfully", data: appointments });
});

const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const appointment = await AppointmentService.getMySingleAppointment(appointmentId as string, user);
  res.status(200).json({ success: true, message: "Appointment retrieved successfully", data: appointment });
});

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const appointments = await AppointmentService.getAllAppointments();
  res.status(200).json({ success: true, message: "All appointments retrieved successfully", data: appointments });
});

const bookAppointmentWithPayLater = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const appointment = await AppointmentService.bookAppointmentWithPayLater(payload, user);
  res.status(201).json({ success: true, message: "Appointment booked successfully with Pay Later option", data: appointment });
});

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const paymentInfo = await AppointmentService.initiatePayment(appointmentId as string, user);
  res.status(200).json({ success: true, message: "Payment initiated successfully", data: paymentInfo });
});

export const AppointmentController = {
  bookAppointment,
  getMyAppointments,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
};

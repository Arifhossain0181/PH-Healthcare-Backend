import express, { Application } from "express";
import { Request, Response } from "express";
import specialityRouter from "./app/module/sPecility/sPecility.router";
import authRouter from "./app/module/auth/auth.router";
import { globalErrorHandler } from "./app/middleware/globalwareErrorHandler";
import { notfundFunction } from "./app/middleware/notfundfunction";
import userRouter from "./app/module/user/user.router";
import cookieParser from "cookie-parser";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./app/config/env";
import qs from "qs";
import cron from "node-cron";
import { AppointmentService } from "./app/module/appointment/appointment.service";
import { PatientRoute } from "./app/module/Patitent/Patient.route";
import { ReviewRoutes } from "./app/module/review/review.route";
import { AppointmentRoutes } from "./app/module/appointment/appointment.route";
import { DoctorScheduleRoutes } from "./app/module/doctorSchedule/doctorSchedule.route";
import { StatsRoutes } from "./app/module/stats/stats.route";
import { PrescriptionRoutes } from "./app/module/PrescriPtion/PrescriPtion.route";
import { doctorRoute as doctorRouter } from "./app/module/doctor/doctor.route";
import { adminRoute as adminRouter } from "./app/module/admin/admin.route";
import { superAdminRoute as superAdminRouter } from "./app/module/superAdmin/superAdmin.route";
import { PaymentRoutes } from "./app/module/Payment/Payment.route";
import { ScheduleRoutes } from "./app/module/schedule/schedule.route";

const app: Application = express();
app.set("query parser",(str : string ) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/temPlete`));

app.post("/webhook",express.raw({type: "application/json"}), (req: Request, res: Response) => {
    console.log("Webhook received:", req.body);
    res.status(200).json({ received: true });
})




app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL], // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  }),
);
app.use("/api/auth", toNodeHandler(auth));
//enable url enacoded form data parsing
app.use(express.urlencoded({ extended: true }));

//middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

cron.schedule("*/2 * * * *",async () => {
  try{
       console.log("Running cron job to cancel unPaid aPPointment")
       await AppointmentService.cancelAppointmentUnPaid()
  }
  catch(error){
    console.error("Error running cron job:", error);
  }

})

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/speciality", specialityRouter);
//doctor router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/patients", PatientRoute);
app.use("/api/v1/stats", StatsRoutes);
app.use("/api/v1/prescriptions",  PrescriptionRoutes );
app.use("/api/v1/reviews", ReviewRoutes);
app.use("/api/v1/appointments", AppointmentRoutes);
app.use("/api/v1/doctors", doctorRouter); 
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/super-admins", superAdminRouter);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/schedules", ScheduleRoutes);
app.use("/api/v1/doctorschedules", DoctorScheduleRoutes);

  


  

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express! Arif");
});
app.use(globalErrorHandler);
app.use(notfundFunction);

export default app;

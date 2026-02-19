import express, { Application,  } from "express";
import { Request, Response } from "express";
import specialityRouter from "./app/module/sPecility/sPecility.router";
import authRouter from "./app/module/auth/auth.router";
import { globalErrorHandler } from "./app/middleware/globalwareErrorHandler";
import { notfundFunction } from "./app/middleware/notfundfunction";
import userRouter from "./app/module/user/user.router";
import cookieParser from "cookie-parser";
const app:Application = express();

//enable url enacoded form data parsing
app.use(express.urlencoded({ extended: true }));

//middleware to parse JSON data
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/auth", authRouter)

app.use("/api/v1/speciality", specialityRouter)
//doctor router
app.use("/api/v1/users", userRouter)



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Arif');
});
app.use(globalErrorHandler)
app.use(notfundFunction)



export default app;
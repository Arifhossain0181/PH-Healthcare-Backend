import express, { Application } from "express";
import { Request, Response } from "express";
import specialityRouter from "./app/module/sPecility/sPecility.router";
import authRouter from "./app/module/auth/auth.router";
const app:Application = express();

//enable url enacoded form data parsing
app.use(express.urlencoded({ extended: true }));

//middleware to parse JSON data
app.use(express.json());
app.use("/api/v1/auth", authRouter)

app.use("/api/v1/speciality", specialityRouter)



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Arif');
});

export default app;
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
dotenv.config();

import Admin from "./routes/Admin";
import Auth from "./routes/Auth";
import Client from "./routes/Client";
import verifyAdmin from "./utils/verifyAdmin";
import verifyOfficer from "./utils/verifyOfficer";
import verifyUser from "./utils/verifyUser";

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000;
const mongoURI: string = process.env.MONGO_URI as string;
const mongoOptions: object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

mongoose.connect(mongoURI, mongoOptions).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello");
});

app.use("/auth", Auth);
app.use("/admin", verifyUser, verifyAdmin, Admin);
app.use("/client", verifyUser, verifyOfficer, Client);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

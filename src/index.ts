import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000;
const mongoURI: string = process.env.MONGO_URI || "";
const mongoOptions: object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set('strictQuery', false)

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

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

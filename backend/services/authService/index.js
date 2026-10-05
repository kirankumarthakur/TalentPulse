import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import { connectToDatabase } from "./configs/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 8888;

const app = express();
await connectToDatabase();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

export default app;

import dotenv from "dotenv";
import express from "express";
import interviewRouter from "./routes/interview.route.js";
import { connectToDatabase } from "./configs/dbConfig.js";

dotenv.config();
await connectToDatabase();

const port = process.env.PORT || 6666;

const app = express();

app.use(express.json());
app.use("/", interviewRouter);

export default app;

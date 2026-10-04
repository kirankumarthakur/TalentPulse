import dotenv from "dotenv";
import express from "express";
import interviewRouter from "./routes/interview.route.js";
import { connectToDatabase } from "./configs/dbConfig.js";

dotenv.config();
connectToDatabase();

const port = process.env.PORT || 6666;

const app = express();

app.use(express.json());
app.use("/", interviewRouter);

app.listen(port, () => {
  console.log(`interviewService is running on port ${port}`);
});

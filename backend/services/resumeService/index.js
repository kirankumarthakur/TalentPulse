import dotenv from "dotenv";
import express from "express";
import { connectToDatabase } from "./configs/dbConfig.js";
import resumeRouter from "./routes/resume.route.js";

dotenv.config();
const port = process.env.PORT || 7777;

const app = express();

app.use(express.json());
app.use("/", resumeRouter);

app.listen(port, () => {
  console.log(`resumeService is running on port ${port}`);
  connectToDatabase();
});
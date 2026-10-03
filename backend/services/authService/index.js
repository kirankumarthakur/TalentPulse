import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import { connectToDatabase } from "./configs/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 8888;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase();
});
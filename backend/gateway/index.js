import dotenv from "dotenv";
import express from "express";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";

dotenv.config();
const port = process.env.PORT || 9999;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", proxy(process.env.URL_AUTH));
app.get("/api/me", authMiddleware, getCurrentUser);

app.listen(port, () => {
  console.log(`Gateway server is running on port ${port}`);
});

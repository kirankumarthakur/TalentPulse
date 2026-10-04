import express from "express";
import { uploadResume, getResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multerHandler.js";

const resumeRouter = express.Router();

resumeRouter.post("/upload", upload.single("resume"), uploadResume);
resumeRouter.get("/download", getResume);

export default resumeRouter;
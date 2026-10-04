import express from "express";
import {
  startInterviewNode,
  submitAnswerNode,
  getInterviewSession,
  getInterviewHistory,
  getAllInterviews,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();
interviewRouter.post("/start", startInterviewNode);
interviewRouter.post("/submit-answer", submitAnswerNode);
interviewRouter.get("/all", getAllInterviews);
interviewRouter.get("/history", getInterviewHistory);
interviewRouter.get("/:interviewId", getInterviewSession);

export default interviewRouter;

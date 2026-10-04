import mongoose from "mongoose";
import questionSchema from "./question.schema.js";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: ["technical", "behavioral"],
      required: true,
    },
    interviewRole: {
      type: String,
      required: true,
    },
    withResume: {
      type: Boolean,
      default: false,
    },
    questionBank: {
      type: [questionSchema],
      default: [],
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    finalScore: {
      type: Number,
      default: 0,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    keyMissingPoints: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["inProgress", "completed"],
      default: "inProgress",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;

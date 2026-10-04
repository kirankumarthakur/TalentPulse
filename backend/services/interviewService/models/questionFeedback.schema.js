import mongoose from "mongoose";

const questionFeedbackSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
    },
    correctness: {
      type: Number,
      default: 0,
    },
    clarity: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    relevance: {
      type: Number,
      default: 0,
    },
    detail: {
      type: Number,
      default: 0,
    },
    efficiency: {
      type: Number,
      default: 0,
    },
    problemSolving: {
      type: Number,
      default: 0,
    },
    creativity: {
      type: Number,
      default: 0,
    },
    criticalThinking: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { _id: false, timestamps: true },
);

export default questionFeedbackSchema;

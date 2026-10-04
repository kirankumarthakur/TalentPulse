import mongoose from "mongoose";
import questionFeedbackSchema from "./questionFeedback.schema.js";

const questionSchema = new mongoose.Schema(
  {
    questionDescription: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      default: "",
    },
    difficultyRating: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    questionTimer: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: questionFeedbackSchema,
      default: () => ({}),
    },
  },
  { _id: false, timestamps: true },
);

export default questionSchema;

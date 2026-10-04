import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
      index: true,
    },
    resumeData: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: "",
    },
    education: {
        type: [String],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: [String],
        default: [],
    },
    projects: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
    achievements: {
        type: [String],
        default: [],
    },
    strengths: {
        type: [String],
        default: [],
    },
    weaknesses: {
        type: [String],
        default: [],
    },
    keymissingSkills: {
        type: [String],
        default: [],
    },
    suggestedRoles: {
        type: String,
        default: "",
    },
    recommendations: {
        type: [String],
        default: [],
    },
  },
  {
    timestamps: true,
    collection: "resume",
  },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
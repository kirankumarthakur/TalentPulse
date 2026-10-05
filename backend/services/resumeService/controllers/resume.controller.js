import redisClient from "../configs/redisConfig.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extractTextFromPDF from "../configs/pdfConfig.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({ success: false, message: "File Missing" });
    }
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found" });
    }

    const extractedText = await extractTextFromPDF(file.path);
    const llmResponse = await resumeAgent(extractedText);
    const resumeParsed = JSON.parse(llmResponse);

    const resume = await Resume.findOneAndUpdate(
      { userId },
      {
        $set: {
          ...resumeParsed,
          resumeData: extractedText,
        },
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    await redisClient.set(`resume:${userId}`, JSON.stringify(resume));
    fs.unlinkSync(file.path);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Error in uploadResume:", error);

    if (file) {
      fs.unlinkSync(file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Error processing resume",
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const cachedResume = await redisClient.get(`resume:${userId}`);
    if (cachedResume) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedResume),
      });
    }

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for the user",
      });
    }
    await redisClient.set(`resume:${userId}`, JSON.stringify(resume));

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: resume,
    });
  } catch (error) {
    console.error("Error in getResume:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving resume",
    });
  }
};

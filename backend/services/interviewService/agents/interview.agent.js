import techInterviewPrompt from "../prompts/techPrompt.js";
import behaviouralInterviewPrompt from "../prompts/behaviouralPrompt.js";
import llm from "../configs/llmConfig.js";

export const interviewAgent = async (data) => {
  try {
    const interviewType = data?.interviewType;
    const prompt =
      interviewType === "technical"
        ? techInterviewPrompt(data)
        : behaviouralInterviewPrompt(data);

    const response = await llm.invoke(prompt);
    const responseText =
      typeof response.content === "string"
        ? response.content
        : response.content.map((part) => part.text || "").join("");
    const processedResponse = responseText
      .trim()
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "");

    return JSON.parse(processedResponse);
  } catch (error) {
    console.error("Error in interviewAgent:", error);
    throw error;
  }
};

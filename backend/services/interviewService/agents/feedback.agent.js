import feedbackInterviewPrompt from "../prompts/feedbackPrompt.js";
import llm from "../configs/llmConfig.js";

export const feedbackAgent = async (data) => {
  try {
    const prompt = feedbackInterviewPrompt(data);
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
    console.error("Error in feedbackAgent:", error);
    throw error;
  }
};

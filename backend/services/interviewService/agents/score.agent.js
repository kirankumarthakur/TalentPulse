import finalInterviewScorePrompt from "../prompts/interviewScore.js";
import llm from "../configs/llmConfig.js";

export const scoreAgent = async (data) => {
  try {
    const prompt = finalInterviewScorePrompt(data);
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
    console.error("Error in scoreAgent:", error);
    throw error;
  }
};

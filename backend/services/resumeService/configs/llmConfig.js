import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();

const llm = new ChatGroq({
  apiKey: process.env.RESUME_GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.1,
  maxTokens: 3000,
  maxRetries: 2,
});

export default llm;
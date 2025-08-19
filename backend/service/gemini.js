import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(chatHistory) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatHistory,
  });

  // Extract the text from the response
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  return text;
}

export default generateResponse;


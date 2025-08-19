import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(chatHistory) {
  try {
    // Get the latest user message
    const latestUserMsg = chatHistory[chatHistory.length - 1];
    const messageText = latestUserMsg.part[0].text;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: messageText }]
        }
      ]
    });

    // Safely extract the text from the response
    const result = await response.response;
    return result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

export default generateResponse;


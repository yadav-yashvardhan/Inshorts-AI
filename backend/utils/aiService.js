import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Helper to safely parse JSON
function safeParseJsonArray(text) {
  try {
    const trimmed = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("JSON Parse Failed:", e.message);
    return [];
  }
}

export async function extractDefinitions(inputText) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is missing in .env");
      return [];
    }

    // Input validation: Text bahut chota ho toh skip karo
    if (!inputText || inputText.length < 15) return [];

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Model Config: Force JSON output for 100% stability
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      You are a helpful dictionary assistant. 
      Analyze the text below and identify 1 to 3 difficult, technical, or complex words that actually appear in the text.
      
      Return a JSON array of objects with keys: "word" and "definition".
      
      Constraints:
      1. Definitions must be very short and simple (maximum 8 words).
      2. The word must match exactly as it appears in the text.
      
      Text: "${inputText.substring(0, 600)}"
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const arr = safeParseJsonArray(text);

    // Final Validation
    return arr
      .filter((x) => x && typeof x.word === "string" && typeof x.definition === "string")
      .slice(0, 3); // Max 3 words hi frontend par bhejo taaki clutter na ho

  } catch (error) {
    // Agar AI fail ho (quota limit ya timeout), toh chupchap empty bhejo
    console.error("⚠️ AI Service Error:", error.message);
    return [];
  }
}

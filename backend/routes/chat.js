// import express from "express";
// import { GoogleGenAI } from "@google/genai";
// import axios from "axios";
// import * as cheerio from "cheerio";

// const router = express.Router();

// function getClient() {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) return null;
//   return new GoogleGenAI({ apiKey });
// }

// router.post("/ask", async (req, res) => {
//   try {
//     const { question, context, mode, title, description } = req.body || {};

//     if (!context || typeof context !== "string") {
//       return res.status(400).json({ error: "context is required" });
//     }

//     const ai = getClient();

//     const normalizedMode = (mode || "default").toLowerCase();

//     const urlLike = typeof context === "string" && /^https?:\/\//i.test(context);
//     let scraped = "";
//     if (urlLike) {
//       try {
//         const resp = await axios.get(context, { timeout: 10000 });
//         const $ = cheerio.load(resp.data);
//         scraped = $("p")
//           .map((_, el) => $(el).text().trim())
//           .get()
//           .filter(Boolean)
//           .join("\n");
//       } catch {
//         scraped = "";
//       }
//     }
//     const effectiveContext = scraped || [title, description].filter(Boolean).join(". ") || context;

//     if (normalizedMode === "bias") {
//       if (!ai) {
//         // Fallback lightweight heuristic when API key is missing
//         const text = effectiveContext.toLowerCase();
//         let score = 0;
//         if (/(progressive|left-wing|liberal)/.test(text)) score -= 3;
//         if (/(conservative|right-wing|republican)/.test(text)) score += 3;
//         const label = score < -2 ? "Left" : score > 2 ? "Right" : "Center";
//         return res.json({ mode: "bias", score, label, analysis: "Heuristic placeholder. Provide GEMINI_API_KEY for full analysis." });
//       }

//       try {
//         const response = await ai.models.generateContent({
//           model: "gemini-2.5-flash-lite",
//           contents:
//             "Analyze the political bias of the following news content. Return ONLY JSON with keys: score (integer -10 to +10, -10 Left to +10 Right), label (Left/Center/Right), and rationale (brief).\n\nContent:\n" +
//             effectiveContext,
//         });
//         const text = response.text || "{}";
//         let parsed;
//         try {
//           parsed = JSON.parse(text);
//         } catch (_) {
//           const match = text.match(/\{[\s\S]*\}/);
//           parsed = match ? JSON.parse(match[0]) : { score: 0, label: "Center", rationale: text };
//         }
//         return res.json({ mode: "bias", ...parsed });
//       } catch {
//         return res.json({ mode: "bias", score: 0, label: "Center", rationale: "Analysis unavailable" });
//       }
//     }

//     // Default and ELI5 paths
//     if (!ai) {
//       // Fallback placeholder when API key missing
//       const concise = (question || "").trim() ? `${question} (answer requires GEMINI_API_KEY)` : "Answer requires GEMINI_API_KEY";
//       return res.json({ mode: normalizedMode, answer: concise });
//     }

//     const instruction =
//       normalizedMode === "eli5"
//         ? "Explain simply like a story suitable for a 5-year-old. Be concise."
//         : normalizedMode === "voice"
//         ? "Be concise and suitable to read aloud. Answer in short sentences."
//         : "Answer concisely based strictly on the context.";
//     try {
//       const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: `You are an expert news analyst. Answer strictly based on the provided context.\n\nContext:\n${effectiveContext}\n\nQuestion:\n${question || "Summarize the key points."}\n\nInstruction:\n${instruction}`,
//       });
//       const answer = response.text || "";
//       return res.json({ mode: normalizedMode, answer });
//     } catch {
//       const concise = (question || "").trim() ? `${question} (analysis unavailable)` : "Analysis unavailable";
//       return res.json({ mode: normalizedMode, answer: concise });
//     }
//   } catch (err) {
//     console.error("/ask error", err);
//     return res.status(500).json({ error: "Internal error" });
//   }
// });

// export default router;


import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper to get Gemini Client safely
function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

router.post("/ask", async (req, res) => {
  try {
    const { question, context, mode, title, description } = req.body || {};

    // Basic Validation
    if (!context && !title) {
      return res.status(400).json({ error: "Context or Title is required" });
    }

    const ai = getClient();
    const normalizedMode = (mode || "default").toLowerCase();

    // ---------------------------------------------------------
    // STEP 1: DEEP READER (Scraping Logic)
    // ---------------------------------------------------------
    const urlLike = typeof context === "string" && /^https?:\/\//i.test(context);
    let scrapedText = "";

    if (urlLike) {
      console.log(`Deep Reader: Scraping URL -> ${context}`);
      try {
        const resp = await axios.get(context, { 
            timeout: 8000, 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } 
        });
        
        const $ = cheerio.load(resp.data);
        
        scrapedText = $("p")
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 20)
          .join("\n");
          
        console.log(`Deep Reader: Scraped ${scrapedText.length} characters.`);
      } catch (scrapeErr) {
        console.error("⚠️ Deep Reader Warning:", scrapeErr.message);
        scrapedText = ""; 
      }
    }

    const effectiveContext = scrapedText.length > 100 
        ? scrapedText 
        : [title, description].filter(Boolean).join(". ") || context;

    // ---------------------------------------------------------
    // STEP 2: BIAS ANALYSIS MODE
    // ---------------------------------------------------------
    if (normalizedMode === "bias") {
      if (!ai) return res.json({ mode: "bias", score: 0, label: "Center", rationale: "API Key Missing" });

      try {
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
          Analyze the political bias. Return ONLY JSON: { "score": -10 to 10, "label": "Left/Center/Right", "rationale": "text" }.
          Content: ${effectiveContext.substring(0, 10000)} 
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let parsed;
        try {
            const jsonString = responseText.replace(/```json|```/g, '').trim();
            parsed = JSON.parse(jsonString);
        } catch (e) {
            parsed = { score: 0, label: "Center", rationale: "Could not parse AI response" };
        }
        return res.json({ mode: "bias", ...parsed });
      } catch (err) {
        console.error("❌ BIAS ERROR:", err.message);
        return res.json({ mode: "bias", score: 0, label: "Center", rationale: "Server Error" });
      }
    }

    // ---------------------------------------------------------
    // STEP 3: DEFAULT / VOICE / ELI5 MODES
    // ---------------------------------------------------------
    if (!ai) return res.json({ mode: normalizedMode, answer: "API Key is missing." });

    let instruction = "Answer concisely based strictly on the context.";
    if (normalizedMode === "eli5") instruction = "Explain simply like a story for a 5-year-old.";
    if (normalizedMode === "voice") instruction = "Answer in short sentences suitable for speech.";

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); 
      const prompt = `
        Context: ${effectiveContext.substring(0, 12000)}
        Question: ${question || "Summarize the key points."}
        Instruction: ${instruction}
      `;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();
      return res.json({ mode: normalizedMode, answer });

    } catch (aiError) {
      console.error("❌ GEMINI ERROR:", aiError.message);
      return res.json({ mode: normalizedMode, answer: "Analysis unavailable (Server Error)." });
    }

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Yahan maine fix kiya hai: default export use kiya hai
export default router;
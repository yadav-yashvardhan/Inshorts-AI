// import express from "express";
// import Article from "../models/Article.js";
// import mongoose from "mongoose";
// import { extractDefinitions } from "../utils/aiService.js";
// import axios from "axios";

// const router = express.Router();

// // ============================================================
// // SMART REAL-TIME NEWS ROUTE (Fallback Logic Added)
// // ============================================================
// router.get("/top-headlines", async (req, res) => {
//   try {
//     const apiKey = process.env.NEWS_API_KEY;
//     console.log("Fetching News... Key Available:", apiKey ? "Yes" : "No");

//     if (!apiKey) {
//       return res.status(400).json({ error: "NEWS_API_KEY is missing in .env" });
//     }

//     // Attempt 1: Try India Technology News
//     let response = await axios.get("https://newsapi.org/v2/top-headlines", {
//       params: { country: "in", category: "technology", apiKey },
//       timeout: 10000,
//       validateStatus: () => true // Prevent crashing on 404
//     });

//     let articles = response.data.articles || [];

//     // Attempt 2: Agar India Tech mein 0 news mili, toh US Tech try karo (Fallback)
//     if (articles.length === 0) {
//       console.log("⚠️ India Tech returned 0 articles. Switching to US Tech...");
      
//       response = await axios.get("https://newsapi.org/v2/top-headlines", {
//         params: { country: "us", category: "technology", apiKey },
//         timeout: 10000
//       });
      
//       articles = response.data.articles || [];
//     }

//     // Attempt 3: Agar US Tech bhi khali hai (Rare), toh General 'AI' Keyword search karo
//     if (articles.length === 0) {
//         console.log("⚠️ US Tech also empty. Fetching general AI news...");
//         response = await axios.get("https://newsapi.org/v2/everything", {
//             params: { q: "Artificial Intelligence", language: "en", sortBy: "publishedAt", apiKey },
//             timeout: 10000
//         });
//         articles = response.data.articles || [];
//     }

//     console.log(`✅ Final Result: Fetched ${articles.length} articles.`);

//     return res.json({ 
//       status: "ok", 
//       totalResults: articles.length, 
//       articles 
//     });

//   } catch (err) {
//     const message = err?.response?.data?.message || err?.message || "NewsAPI request failed";
//     console.error("❌ NewsAPI Error:", message);
//     return res.status(502).json({ error: "top-headlines failed", message });
//   }
// });

// // ============================================================
// // SYNC ROUTE (Database Save)
// // ============================================================
// router.get("/sync", async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       return res.status(500).json({ error: "MongoDB not connected." });
//     }

//     const apiKey = process.env.NEWS_API_KEY;
//     if (!apiKey) return res.status(400).json({ error: "NEWS_API_KEY is missing" });

//     // Sync ke liye hum broad search use karenge
//     const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`;
//     const resp = await fetch(url);
    
//     if (!resp.ok) {
//       const text = await resp.text();
//       return res.status(resp.status).json({ error: "NewsAPI error", details: text });
//     }
    
//     const data = await resp.json();
//     const items = Array.isArray(data.articles) ? data.articles : [];

//     let upserts = 0;
//     for (const a of items) {
//       const publishedAt = a.publishedAt ? new Date(a.publishedAt) : undefined;
//       const text = [a.title, a.description, a.content].filter(Boolean).join(". ");
      
//       let difficultWords = [];
//       try {
//         if(extractDefinitions) difficultWords = await extractDefinitions(text);
//       } catch (e) { difficultWords = []; }

//       const update = {
//         title: a.title, description: a.description, content: a.content,
//         url: a.url, urlToImage: a.urlToImage, source: a.source,
//         publishedAt, difficultWords,
//       };

//       if (!update.url) continue;
      
//       await Article.findOneAndUpdate({ url: update.url }, update, { upsert: true, new: true, setDefaultsOnInsert: true });
//       upserts++;
//     }
//     return res.json({ status: "ok", upserts });
//   } catch (err) {
//     console.error("Sync Failed:", err);
//     return res.status(500).json({ error: "sync failed" });
//   }
// });

// // ============================================================
// // FETCH ALL FROM DB
// // ============================================================
// router.get("/all", async (_req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) return res.json([]);
//     const items = await Article.find({}).sort({ publishedAt: -1 }).lean();
//     return res.json(items);
//   } catch (err) {
//     return res.status(500).json({ error: "fetch failed" });
//   }
// });

// export default router;


// import express from "express";
// import { extractDefinitions } from "../utils/aiService.js";
// import axios from "axios";

// const router = express.Router();

// router.get("/top-headlines", async (req, res) => {
//   try {
//     const apiKey = process.env.NEWS_API_KEY;
//     if (!apiKey) return res.status(400).json({ error: "API Key Missing" });

//     // 1. News Fetch Karo (US try karo kyunki wahan data better hota hai)
//     let response = await axios.get("https://newsapi.org/v2/top-headlines", {
//       params: { country: "us", category: "technology", apiKey }, // India ke liye 'in' kar sakte ho
//       validateStatus: () => true 
//     });

//     let articles = response.data.articles || [];

//     // 2. FILTER: Kachra Hatao (Jinki Image ya Description bilkul nahi hai)
//     // Hum wahi articles rakhenge jisme kam se kam Title aur URL ho.
//     articles = articles.filter(a => 
//         a.title !== "[Removed]" && 
//         a.url
//     );

//     // 3. Process Top 3 Articles for AI Meanings
//     const processedArticles = await Promise.all(articles.map(async (article, index) => {
//         // Agar Description nahi hai, toh Title use karo (Fallback)
//         const textToAnalyze = (article.description || article.title || "").trim();
        
//         // Sirf shuru ke 3 articles ke liye AI chalayenge (Speed ke liye)
//         let difficultWords = [];
//         if (index < 3 && textToAnalyze.length > 20) { 
//             try {
//                 difficultWords = await extractDefinitions(textToAnalyze);
//             } catch (e) {
//                 console.log("AI failed for index", index);
//             }
//         }

//         return { 
//             ...article, 
//             // Agar description null hai, toh Title hi description bana do taaki card khali na dikhe
//             description: article.description || "Click 'Read with AI' to view full details of this story.",
//             difficultWords 
//         };
//     }));

//     return res.json({ 
//       status: "ok", 
//       totalResults: processedArticles.length, 
//       articles: processedArticles 
//     });

//   } catch (err) {
//     return res.status(502).json({ error: "Failed to fetch news" });
//   }
// });

// export default router;


import express from "express";
import { extractDefinitions } from "../utils/aiService.js";

const router = express.Router();

// Helper: Local Definitions (Fast Fallback)
function getLocalDifficultWords(text) {
    if (!text) return [];
    const words = text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, ""));
    const longWords = words.filter(w => w.length > 7);
    return [...new Set(longWords)].slice(0, 3).map(word => ({
        word: word,
        definition: "Important term identified in the context."
    }));
}

// Helper: Array Shuffle Function (Taash ke patte mix karne jaisa)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

router.get("/top-headlines", async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY ? process.env.NEWS_API_KEY.trim() : "";
    if (!apiKey) return res.status(400).json({ error: "API Key Missing" });

    // CHANGE 1: pageSize=80 (Hum zyada news mangenge taaki mix kar sakein)
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=80&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    let articles = data.articles || [];

    // Filter Bad Articles
    articles = articles.filter(a => a.title !== "[Removed]" && a.url);

    // CHANGE 2: Shuffle the Articles! (Har request par order change ho jayega)
    articles = shuffleArray(articles);

    // Sirf Top 20 bhejo (Shuffle hone ke baad)
    articles = articles.slice(0, 20);

    console.log(`📡 Fetched & Shuffled. Sending ${articles.length} articles.`);

    // 3. Process Definitions (Hybrid Mode)
    const processedArticles = [];
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];
        let difficultWords = [];
        const textToAnalyze = (article.description || article.title || "").trim();

        if (textToAnalyze.length > 20) {
            // Sirf Top 2 cards par Real AI (Quota bachane ke liye)
            if (i < 2) {
                try {
                    difficultWords = await extractDefinitions(textToAnalyze);
                    if (!difficultWords || difficultWords.length === 0) {
                         difficultWords = getLocalDifficultWords(textToAnalyze);
                    }
                } catch (e) {
                    difficultWords = getLocalDifficultWords(textToAnalyze);
                }
            } 
            // Baaki sab par Local Logic (Fast)
            else {
                difficultWords = getLocalDifficultWords(textToAnalyze);
            }
        }

        processedArticles.push({
            ...article,
            description: article.description || "Click 'Read with AI' for full details.",
            difficultWords: difficultWords
        });
    }

    return res.json({ 
      status: "ok", 
      totalResults: processedArticles.length, 
      articles: processedArticles 
    });

  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(502).json({ error: "Failed to fetch news" });
  }
});

export default router;
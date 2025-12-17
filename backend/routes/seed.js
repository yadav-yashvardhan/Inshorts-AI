import express from "express";
import Article from "../models/Article.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: "MongoDB not connected" });
    }

    const samples = [
      {
        title: "India unveils national AI compute grid to boost startups",
        description: "A government-led AI compute grid opens access to GPUs for research and early-stage companies.",
        content:
          "The initiative aims to democratize access to high-performance compute for universities and startups, reducing reliance on foreign clouds.",
        url: "https://example.com/tech/india-ai-compute-grid",
        urlToImage: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3",
        source: { id: null, name: "TechDesk" },
        publishedAt: new Date(),
        difficultWords: [
          { word: "democratize", definition: "Make accessible to everyone, not just a select few." },
          { word: "compute", definition: "Processing power used for running complex software or models." },
          { word: "reliance", definition: "Dependence on something or someone for support." },
          { word: "initiative", definition: "A plan or program designed to address a problem." },
          { word: "universities", definition: "Institutions for higher education and research." },
        ],
      },
      {
        title: "Parliament passes data protection bill after intense debate",
        description: "Lawmakers approve comprehensive privacy regulations for digital services.",
        content:
          "The bill introduces stricter consent requirements and heavy penalties for misuse, aiming to safeguard citizens' data.",
        url: "https://example.com/politics/data-protection-bill",
        urlToImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
        source: { id: null, name: "CivicWatch" },
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        difficultWords: [
          { word: "comprehensive", definition: "Covering many or all aspects of something." },
          { word: "consent", definition: "Permission for something to happen or agreement to do something." },
          { word: "penalties", definition: "Punishments for breaking a law or rule." },
          { word: "safeguard", definition: "Protect from harm or damage." },
          { word: "regulations", definition: "Rules made by authorities to control activities." },
        ],
      },
      {
        title: "Cricket board announces expanded women's league for 2026",
        description: "New franchises and increased prize pools aim to grow the sport's popularity.",
        content:
          "The expansion will include home-and-away fixtures and a developmental academy program for young talent.",
        url: "https://example.com/sports/womens-cricket-league-expansion",
        urlToImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
        source: { id: null, name: "SportLine" },
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        difficultWords: [
          { word: "franchises", definition: "Teams authorized to operate within a sports league." },
          { word: "fixtures", definition: "Scheduled matches between teams." },
          { word: "developmental", definition: "Focused on growth and improvement of skills." },
          { word: "academy", definition: "A place focused on teaching specialized skills." },
          { word: "popularity", definition: "The state of being liked or supported by many people." },
        ],
      },
      {
        title: "Major smartphone maker debuts on-device translation breakthrough",
        description: "New models feature low-latency translation without cloud connectivity.",
        content:
          "The vendor claims the system reduces energy consumption while improving accuracy for code-switching contexts.",
        url: "https://example.com/tech/on-device-translation-breakthrough",
        urlToImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        source: { id: null, name: "GadgetPulse" },
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        difficultWords: [
          { word: "latency", definition: "Delay between input and response." },
          { word: "connectivity", definition: "Ability to connect to networks or devices." },
          { word: "consumption", definition: "Amount of energy or resources used." },
          { word: "accuracy", definition: "How correct or precise results are." },
          { word: "contexts", definition: "Situations or settings that influence meaning." },
        ],
      },
      {
        title: "Budget proposes incentives for semiconductor fabrication units",
        description: "Government outlines tax credits for firms building chip manufacturing plants.",
        content:
          "Analysts say incentives could shorten timelines for domestic fabs and attract global partners.",
        url: "https://example.com/politics/semiconductor-fab-incentives",
        urlToImage: "https://images.unsplash.com/photo-1580894908360-6b2f8f7e9b7f",
        source: { id: null, name: "PolicyWire" },
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        difficultWords: [
          { word: "semiconductor", definition: "Material used to make electronic chips." },
          { word: "fabrication", definition: "Process of building or manufacturing something." },
          { word: "credits", definition: "Reductions in taxes owed." },
          { word: "domestic", definition: "Existing or produced within a country." },
          { word: "partners", definition: "Organizations working together toward a goal." },
        ],
      },
    ];

    await Article.deleteMany({});
    const inserted = await Article.insertMany(samples);
    return res.json({ status: "seeded", count: inserted.length });
  } catch (err) {
    return res.status(500).json({ error: "seed failed" });
  }
});

export default router;


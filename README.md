# 📰 Inshorts AI

> **News that explains itself.**

Inshorts AI is a next-gen news aggregator built to bridge the gap between "reading" and "understanding." Unlike traditional apps that just dump headlines, this project uses **Generative AI (RAG)** to provide deep context, explain complex jargon instantly, and answer user queries in real-time.

Built with **Next.js (App Router)**, **Node.js**, and **Google Gemini**.

---

## 🚀 Why this project?

Reading geopolitical or financial news can be tough due to heavy jargon. I wanted to build a platform where:
1.  **You don't Google words:** Just hover over difficult words, and the meaning pops up instantly.
2.  **You can talk to the news:** A "Jarvis-like" AI analyst that reads the full article and answers questions like *"Is this good for the Indian economy?"* or *"Explain like I'm 5."*

---

## ✨ Key Features

- **🧠 Smart Context Engine:** Automatically detects complex words in headlines and provides tooltip definitions without breaking the reading flow.
- **🤖 AI Analyst Sidebar (RAG):** Uses **Retrieval Augmented Generation** to chat about the specific news article you are reading.
- **🎙️ Voice-to-Voice Mode:** Full hands-free experience using the Web Speech API. Ask questions verbally, and the AI replies in voice.
- **🔍 Deep Reading:** Uses **Cheerio** to scrape the full article content (not just the description) for accurate AI analysis.
- **⚖️ Bias & Fact Check:** One-click analysis to detect political bias in the news source.

---

## 🛠️ Tech Stack

**Frontend:**
- **Next.js 14** (App Router, Server Actions)
- **Tailwind CSS** (Styling & Responsive Design)
- **Lucide React** (Icons)

**Backend:**
- **Node.js & Express** (REST API)
- **MongoDB** (Data Persistence)
- **Cheerio.js** (Web Scraping)

**AI & APIs:**
- **Google Gemini API** (LLM for definitions & chat)
- **NewsAPI.org** (Live headlines)
- **Web Speech API** (Native Browser STT/TTS)

---

## ⚡ Getting Started

The project is set up with a root script manager, so you don't need to switch folders constantly.


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import newsRouter from "./routes/news.js";
import seedRouter from "./routes/seed.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: false }));
app.use(express.json({ limit: "1mb" }));

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(() => console.error("MongoDB connection failed"));
} else {
  console.warn("MONGO_URI not set. News storage disabled.");
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/chat", chatRouter);
app.use("/api/news", newsRouter);
app.use("/api/news/seed", seedRouter);

app.listen(PORT, () => {
  console.log(`AI Analyst server listening on http://localhost:${PORT}`);
});

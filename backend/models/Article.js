import mongoose from "mongoose";

const DifficultWordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    definition: { type: String, required: true },
  },
  { _id: false }
);

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    content: { type: String },
    url: { type: String, unique: true },
    urlToImage: { type: String },
    source: { type: Object },
    publishedAt: { type: Date },
    difficultWords: { type: [DifficultWordSchema], default: [] },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
export default Article;

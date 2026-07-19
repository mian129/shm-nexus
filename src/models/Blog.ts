import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: "" },
  featuredImage: { type: String, default: "" },
  author: { type: String, default: "SHM Nexus" },
  tags: [{ type: String }],
  category: { type: String, default: "General" },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;

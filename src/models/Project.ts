import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  client: { type: String, default: "" },
  year: { type: String, default: "" },
  details: [{ type: String }],
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;

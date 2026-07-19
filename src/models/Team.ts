import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String, default: "" },
  photo: { type: String, default: "" },
  order: { type: Number, default: 0 },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;

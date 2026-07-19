import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: "Code" },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;

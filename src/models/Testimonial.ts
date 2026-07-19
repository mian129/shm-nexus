import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  company: { type: String, default: "" },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  review: { type: String, required: true },
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;

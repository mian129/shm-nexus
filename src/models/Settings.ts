import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  siteLogo: { type: String, default: "" },
  siteTitle: { type: String, default: "SHM Nexus" },
  tagline: { type: String, default: "Your Digital Growth Partner" },
  footerText: { type: String, default: "© 2024 SHM Nexus. All rights reserved." },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  contactInfo: {
    email: { type: String, default: "shmnexus@gmail.com" },
    phone: { type: String, default: "+92 300 1234567" },
    address: { type: String, default: "Lahore, Pakistan" },
    workingHours: { type: String, default: "Mon - Sat: 9:00 AM - 6:00 PM" },
  },
});

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;

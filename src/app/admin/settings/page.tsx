"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTitle: "SHM Nexus",
    tagline: "Your Digital Growth Partner",
    footerText: "© 2024 SHM Nexus. All rights reserved.",
    contactInfo: { email: "shmnexus@gmail.com", phone: "+92 300 1234567", address: "Lahore, Pakistan", workingHours: "Mon - Sat: 9:00 AM - 6:00 PM" },
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
  });
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data && data._id) setSettings(data);
    } catch (error) {}
  };

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleSave = async () => {
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    showNotice("success", "Settings saved.");
  };

  return (
    <div>
      {notice && (
        <div className={`admin-notice ${notice.type}`}>
          {notice.msg}
          <button className="admin-notice-dismiss" onClick={() => setNotice(null)}><X size={14} /></button>
        </div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <button onClick={handleSave} className="admin-btn admin-btn-orange">
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="admin-card" style={{ marginBottom: "24px" }}>
        <div className="admin-card-header">
          <h3>General</h3>
        </div>
        <div style={{ padding: "20px 0 0" }}>
          <div className="admin-form-group">
            <label className="admin-label">Site Title</label>
            <input value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Tagline</label>
            <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Footer Text</label>
            <input value={settings.footerText} onChange={(e) => setSettings({ ...settings, footerText: e.target.value })} className="admin-input" />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="admin-card" style={{ marginBottom: "24px" }}>
        <div className="admin-card-header">
          <h3>Contact Information</h3>
        </div>
        <div style={{ padding: "20px 0 0" }}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Email</label>
              <input value={settings.contactInfo.email} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Phone</label>
              <input value={settings.contactInfo.phone} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })} className="admin-input" />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Address</label>
            <input value={settings.contactInfo.address} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })} className="admin-input" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Working Hours</label>
            <input value={settings.contactInfo.workingHours} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, workingHours: e.target.value } })} className="admin-input" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="admin-card" style={{ marginBottom: "24px" }}>
        <div className="admin-card-header">
          <h3>Social Media Links</h3>
        </div>
        <div style={{ padding: "20px 0 0" }}>
          <div className="admin-form-row">
            {Object.entries(settings.socialLinks).map(([platform, url]) => (
              <div key={platform} className="admin-form-group">
                <label className="admin-label" style={{ textTransform: "capitalize" }}>{platform}</label>
                <input value={url} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })} className="admin-input" placeholder={`https://${platform}.com/yourprofile`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

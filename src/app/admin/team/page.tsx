"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";

export default function AdminTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const [form, setForm] = useState({ name: "", designation: "", bio: "", photo: "", socialLinks: { linkedin: "", twitter: "", instagram: "" } });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    const res = await fetch("/api/team");
    const data = await res.json();
    setTeam(Array.isArray(data) ? data : []);
  };

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingMember;
    if (editingMember) {
      await fetch("/api/team", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editingMember._id }) });
    } else {
      await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false); setEditingMember(null);
    setForm({ name: "", designation: "", bio: "", photo: "", socialLinks: { linkedin: "", twitter: "", instagram: "" } });
    fetchTeam(); showNotice("success", isEditing ? "Member updated." : "Member added.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    fetchTeam(); showNotice("success", "Member removed.");
  };

  const openAdd = () => {
    setEditingMember(null);
    setForm({ name: "", designation: "", bio: "", photo: "", socialLinks: { linkedin: "", twitter: "", instagram: "" } });
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, photo: data.url }));
        showNotice("success", "Photo uploaded.");
      }
    } catch (err) {
      showNotice("error", "Upload failed.");
    }
    setUploading(false);
  };

  const openEdit = (member: any) => {
    setEditingMember(member);
    setForm({ name: member.name, designation: member.designation, bio: member.bio || "", photo: member.photo || "", socialLinks: member.socialLinks || { linkedin: "", twitter: "", instagram: "" } });
    setShowModal(true);
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
        <h1 className="admin-page-title">Team Members</h1>
        <button onClick={openAdd} className="admin-btn admin-btn-orange">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Bio</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No team members found.</td></tr>
              ) : team.map((member) => (
                <tr key={member._id}>
                  <td className="title-col">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FF6B0015", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {member.photo ? (
                          <img src={member.photo} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF6B00" }}>{member.name?.split(" ").map((n: string) => n[0]).join("")}</span>
                        )}
                      </div>
                      <a onClick={() => openEdit(member)} style={{ cursor: "pointer" }}>{member.name}</a>
                    </div>
                  </td>
                  <td><span className="admin-badge orange">{member.designation}</span></td>
                  <td style={{ maxWidth: "300px" }} className="line-clamp-1">{member.bio || "—"}</td>
                  <td className="actions-col">
                    <button onClick={() => openEdit(member)} className="admin-btn-ghost admin-btn-sm" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(member._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>
              <button onClick={() => setShowModal(false)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <form id="teamForm" onSubmit={handleSubmit}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Designation *</label>
                    <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="admin-input" required />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input admin-textarea" rows={3} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Profile Photo</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    {form.photo && (
                      <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #DcdcDC" }}>
                        <img src={form.photo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="admin-btn admin-btn-secondary" disabled={uploading} style={{ marginBottom: "8px" }}>
                        <Upload size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
                      </button>
                      <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" placeholder="Or paste image URL" />
                    </div>
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">LinkedIn</label>
                    <input value={form.socialLinks.linkedin} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Twitter</label>
                    <input value={form.socialLinks.twitter} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Instagram</label>
                  <input value={form.socialLinks.instagram} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} className="admin-input" />
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" form="teamForm" className="admin-btn admin-btn-orange">{editingMember ? "Update" : "Add Member"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

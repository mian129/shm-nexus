"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Star } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const [form, setForm] = useState({ clientName: "", company: "", rating: 5, review: "", photo: "" });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(Array.isArray(data) ? data : []);
  };

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editing;
    if (editing) {
      await fetch("/api/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing._id }) });
    } else {
      await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false); setEditing(null);
    setForm({ clientName: "", company: "", rating: 5, review: "", photo: "" });
    fetchTestimonials(); showNotice("success", isEditing ? "Testimonial updated." : "Testimonial added.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    fetchTestimonials(); showNotice("success", "Testimonial deleted.");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} testimonials?`)) return;
    for (const id of selected) { await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" }); }
    setSelected([]); fetchTestimonials(); showNotice("success", `${selected.length} testimonials deleted.`);
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
        <h1 className="admin-page-title">Testimonials</h1>
        <button onClick={() => { setEditing(null); setForm({ clientName: "", company: "", rating: 5, review: "", photo: "" }); setShowModal(true); }} className="admin-btn admin-btn-orange">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="admin-toolbar">
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger admin-btn-sm">
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="check-col"><input type="checkbox" checked={selected.length === testimonials.length && testimonials.length > 0} onChange={() => setSelected(selected.length === testimonials.length ? [] : testimonials.map((t) => t._id))} /></th>
                <th>Client</th>
                <th>Company</th>
                <th>Rating</th>
                <th>Review</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No testimonials found.</td></tr>
              ) : testimonials.map((t) => (
                <tr key={t._id}>
                  <td className="check-col"><input type="checkbox" checked={selected.includes(t._id)} onChange={() => setSelected(selected.includes(t._id) ? selected.filter((id) => id !== t._id) : [...selected, t._id])} /></td>
                  <td className="title-col">
                    <a onClick={() => { setEditing(t); setForm({ clientName: t.clientName, company: t.company || "", rating: t.rating, review: t.review, photo: t.photo || "" }); setShowModal(true); }} style={{ cursor: "pointer" }}>{t.clientName}</a>
                  </td>
                  <td>{t.company || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= t.rating ? "text-orange fill-orange" : "text-gray-300"} />
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: "250px" }} className="line-clamp-1">{t.review}</td>
                  <td className="actions-col">
                    <button onClick={() => { setEditing(t); setForm({ clientName: t.clientName, company: t.company || "", rating: t.rating, review: t.review, photo: t.photo || "" }); setShowModal(true); }} className="admin-btn-ghost admin-btn-sm" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(t._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
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
              <h2>{editing ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <form id="testimonialForm" onSubmit={handleSubmit}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Client Name *</label>
                    <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="admin-input" required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Company</label>
                    <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Rating</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
                        <Star size={24} className={star <= form.rating ? "text-orange fill-orange" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Review *</label>
                  <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="admin-input admin-textarea" rows={4} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Photo URL</label>
                  <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" />
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" form="testimonialForm" className="admin-btn admin-btn-orange">{editing ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

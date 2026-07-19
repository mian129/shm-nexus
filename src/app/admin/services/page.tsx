"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "Code", features: "", order: 0 });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services-route");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
  };

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingService;
    const body = { ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) };
    if (editingService) {
      await fetch("/api/services-route", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, id: editingService._id }) });
    } else {
      await fetch("/api/services-route", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowModal(false); setEditingService(null);
    setForm({ title: "", description: "", icon: "Code", features: "", order: 0 });
    fetchServices(); showNotice("success", isEditing ? "Service updated." : "Service created.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/services-route?id=${id}`, { method: "DELETE" });
    fetchServices(); showNotice("success", "Service deleted.");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} services?`)) return;
    for (const id of selected) { await fetch(`/api/services-route?id=${id}`, { method: "DELETE" }); }
    setSelected([]); fetchServices(); showNotice("success", `${selected.length} services deleted.`);
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
        <h1 className="admin-page-title">Services</h1>
        <button onClick={() => { setEditingService(null); setForm({ title: "", description: "", icon: "Code", features: "", order: 0 }); setShowModal(true); }} className="admin-btn admin-btn-orange">
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
                <th className="check-col"><input type="checkbox" checked={selected.length === services.length && services.length > 0} onChange={() => setSelected(selected.length === services.length ? [] : services.map((s) => s._id))} /></th>
                <th>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th>Features</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No services found.</td></tr>
              ) : services.map((service) => (
                <tr key={service._id}>
                  <td className="check-col"><input type="checkbox" checked={selected.includes(service._id)} onChange={() => setSelected(selected.includes(service._id) ? selected.filter((id) => id !== service._id) : [...selected, service._id])} /></td>
                  <td>{service.order}</td>
                  <td className="title-col"><a onClick={() => { setEditingService(service); setForm({ title: service.title, description: service.description, icon: service.icon || "Code", features: (service.features || []).join(", "), order: service.order || 0 }); setShowModal(true); }} style={{ cursor: "pointer" }}>{service.title}</a></td>
                  <td style={{ maxWidth: "300px" }} className="line-clamp-1">{service.description}</td>
                  <td><span className="admin-badge gray">{(service.features || []).length} features</span></td>
                  <td className="actions-col">
                    <button onClick={() => { setEditingService(service); setForm({ title: service.title, description: service.description, icon: service.icon || "Code", features: (service.features || []).join(", "), order: service.order || 0 }); setShowModal(true); }} className="admin-btn-ghost admin-btn-sm" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(service._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
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
              <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
              <button onClick={() => setShowModal(false)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <form id="serviceForm" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input admin-textarea" required />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Icon Name</label>
                    <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="admin-input" placeholder="Code" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Features (comma separated)</label>
                  <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="admin-input" placeholder="Feature 1, Feature 2, Feature 3" />
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" form="serviceForm" className="admin-btn admin-btn-orange">{editingService ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

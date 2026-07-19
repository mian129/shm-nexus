"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Star, X, Search, ChevronDown } from "lucide-react";
import Link from "next/link";

const categories = ["Web Development", "SEO", "Graphic Design", "Branding", "Marketing", "Video Production", "Social Media", "E-Commerce"];

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const perPage = 10;
  const [form, setForm] = useState({ slug: "", title: "", description: "", category: "Web Development", client: "", year: "2024", details: [] as string[], images: [] as string[], featured: false });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  const filtered = projects.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const showNotice = (type: string, msg: string) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingProject;
    const method = editingProject ? "PUT" : "POST";
    const body = editingProject ? { ...form, id: editingProject._id } : form;
    await fetch("/api/projects", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false);
    setEditingProject(null);
    setForm({ slug: "", title: "", description: "", category: "Web Development", client: "", year: "2024", details: [], images: [], featured: false });
    fetchProjects();
    showNotice("success", isEditing ? "Project updated." : "Project created.");
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setForm({ slug: project.slug || "", title: project.title, description: project.description, category: project.category, client: project.client || "", year: project.year || "2024", details: project.details || [], images: project.images || [], featured: project.featured });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
    showNotice("success", "Project deleted.");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} projects?`)) return;
    for (const id of selected) { await fetch(`/api/projects?id=${id}`, { method: "DELETE" }); }
    setSelected([]);
    fetchProjects();
    showNotice("success", `${selected.length} projects deleted.`);
  };

  const toggleSelectAll = () => {
    if (selected.length === paged.length) { setSelected([]); }
    else { setSelected(paged.map((p) => p._id)); }
  };

  return (
    <div>
      {notice && (
        <div className={`admin-notice ${notice.type}`}>
          {notice.type === "success" ? <CheckIcon /> : <XIcon />}
          {notice.msg}
          <button className="admin-notice-dismiss" onClick={() => setNotice(null)}><X size={14} /></button>
        </div>
      )}

      <div className="admin-page-header">
        <h1 className="admin-page-title">Projects</h1>
        <button onClick={() => { setEditingProject(null); setForm({ slug: "", title: "", description: "", category: "Web Development", client: "", year: "2024", details: [], images: [], featured: false }); setShowModal(true); }} className="admin-btn admin-btn-orange">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="admin-input" style={{ width: "auto", padding: "5px 36px 5px 10px" }}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger admin-btn-sm">
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
        <div style={{ marginLeft: "auto" }}>
          <input type="text" className="admin-input" placeholder="Search projects..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: "200px", padding: "5px 10px" }} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="check-col"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleSelectAll} /></th>
                <th>Title</th>
                <th>Category</th>
                <th>Client</th>
                <th>Featured</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No projects found.</td></tr>
              ) : paged.map((project) => (
                <tr key={project._id}>
                  <td className="check-col"><input type="checkbox" checked={selected.includes(project._id)} onChange={() => setSelected(selected.includes(project._id) ? selected.filter((id) => id !== project._id) : [...selected, project._id])} /></td>
                  <td className="title-col"><a onClick={() => handleEdit(project)} style={{ cursor: "pointer" }}>{project.title}</a></td>
                  <td><span className="admin-badge orange capitalize">{project.category}</span></td>
                  <td>{project.client || "—"}</td>
                  <td>{project.featured ? <Star className="text-orange fill-orange" size={14} /> : <span style={{ color: "#DcdcDC" }}>—</span>}</td>
                  <td className="actions-col">
                    <button onClick={() => handleEdit(project)} className="admin-btn-ghost admin-btn-sm" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(project._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span>Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</span>
            <div className="admin-pagination-links">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === currentPage ? "active" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProject ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={() => setShowModal(false)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <form id="projectForm" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Slug * (URL-friendly)</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })} className="admin-input" required placeholder="e.g. social-media-design" />
                </div>
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
                    <label className="admin-label">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input admin-select">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Client Name</label>
                    <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Year</label>
                  <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="admin-input" placeholder="2024" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Details (What We Did) — one per line</label>
                  <textarea
                    className="admin-input admin-textarea"
                    rows={4}
                    value={form.details.join("\n")}
                    onChange={(e) => setForm({ ...form, details: e.target.value.split("\n").filter((l) => l.trim()) })}
                    placeholder="Custom website design&#10;Payment gateway integration&#10;..."
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Image URLs — one per line</label>
                  <textarea
                    className="admin-input admin-textarea"
                    rows={3}
                    value={form.images.join("\n")}
                    onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter((l) => l.trim()) })}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "#FF6B00" }} />
                    <span className="admin-label" style={{ margin: 0 }}>Featured Project</span>
                  </label>
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" form="projectForm" className="admin-btn admin-btn-orange">
                {editingProject ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
}
function XIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

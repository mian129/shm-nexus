"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Eye } from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const perPage = 10;
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", author: "SHM Nexus", category: "General", featuredImage: "", tags: "" });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
  };

  const filtered = blogs.filter((b) => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingBlog;
    const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editingBlog) {
      await fetch("/api/blogs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, id: editingBlog._id }) });
    } else {
      await fetch("/api/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowModal(false); setEditingBlog(null);
    setForm({ title: "", content: "", excerpt: "", author: "SHM Nexus", category: "General", featuredImage: "", tags: "" });
    fetchBlogs();
    showNotice("success", isEditing ? "Post updated." : "Post created.");
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setForm({ title: blog.title, content: blog.content, excerpt: blog.excerpt || "", author: blog.author, category: blog.category, featuredImage: blog.featuredImage || "", tags: (blog.tags || []).join(", ") });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs(); showNotice("success", "Post deleted.");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} posts?`)) return;
    for (const id of selected) { await fetch(`/api/blogs?id=${id}`, { method: "DELETE" }); }
    setSelected([]); fetchBlogs(); showNotice("success", `${selected.length} posts deleted.`);
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
        <h1 className="admin-page-title">Posts</h1>
        <button onClick={() => { setEditingBlog(null); setForm({ title: "", content: "", excerpt: "", author: "SHM Nexus", category: "General", featuredImage: "", tags: "" }); setShowModal(true); }} className="admin-btn admin-btn-orange">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="admin-toolbar">
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger admin-btn-sm">
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
        <div style={{ marginLeft: "auto" }}>
          <input type="text" className="admin-input" placeholder="Search posts..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: "200px", padding: "5px 10px" }} />
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="check-col"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={() => setSelected(selected.length === paged.length ? [] : paged.map((b) => b._id))} /></th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No posts found.</td></tr>
              ) : paged.map((blog) => (
                <tr key={blog._id}>
                  <td className="check-col"><input type="checkbox" checked={selected.includes(blog._id)} onChange={() => setSelected(selected.includes(blog._id) ? selected.filter((id) => id !== blog._id) : [...selected, blog._id])} /></td>
                  <td className="title-col"><a onClick={() => handleEdit(blog)} style={{ cursor: "pointer" }}>{blog.title}</a></td>
                  <td><span className="admin-badge blue">{blog.category}</span></td>
                  <td>{blog.author}</td>
                  <td>{blog.views || 0}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="actions-col">
                    <button onClick={() => handleEdit(blog)} className="admin-btn-ghost admin-btn-sm" title="Edit"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(blog._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
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

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingBlog ? "Edit Post" : "Add New Post"}</h2>
              <button onClick={() => setShowModal(false)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <form id="blogForm" onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="admin-input" rows={2} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Content *</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="admin-input admin-textarea" rows={10} style={{ fontFamily: "monospace", fontSize: "13px" }} required />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Author</label>
                    <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Featured Image URL</label>
                  <input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="admin-input" placeholder="seo, marketing, tips" />
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button type="submit" form="blogForm" className="admin-btn admin-btn-orange">
                {editingBlog ? "Update Post" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

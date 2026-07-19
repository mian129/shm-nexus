"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, X, Mail, Phone, Search } from "lucide-react";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const perPage = 10;

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    const res = await fetch("/api/inquiries");
    const data = await res.json();
    setInquiries(Array.isArray(data) ? data : []);
  };

  const filtered = inquiries.filter((i) => {
    if (filterStatus === "unread" && i.read) return false;
    if (filterStatus === "read" && !i.read) return false;
    if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase()) && !i.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const markAsRead = async (id: string) => {
    await fetch("/api/inquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read: true }) });
    fetchInquiries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    fetchInquiries(); setSelectedInquiry(null); showNotice("success", "Inquiry deleted.");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} inquiries?`)) return;
    for (const id of selected) { await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" }); }
    setSelected([]); fetchInquiries(); showNotice("success", `${selected.length} inquiries deleted.`);
  };

  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      {notice && (
        <div className={`admin-notice ${notice.type}`}>
          {notice.msg}
          <button className="admin-notice-dismiss" onClick={() => setNotice(null)}><X size={14} /></button>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inquiries</h1>
          <p style={{ color: "#787C82", fontSize: "14px", margin: "4px 0 0" }}>
            {unreadCount > 0 ? <span style={{ color: "#FF6B00", fontWeight: 600 }}>{unreadCount} unread</span> : "All caught up"}
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="admin-input" style={{ width: "auto", padding: "5px 36px 5px 10px" }}>
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger admin-btn-sm">
            <Trash2 size={14} /> Delete ({selected.length})
          </button>
        )}
        <div style={{ marginLeft: "auto" }}>
          <input type="text" className="admin-input" placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: "200px", padding: "5px 10px" }} />
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="check-col"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={() => setSelected(selected.length === paged.length ? [] : paged.map((i) => i._id))} /></th>
                <th style={{ width: "40px" }}></th>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No inquiries found.</td></tr>
              ) : paged.map((inquiry) => (
                <tr key={inquiry._id} style={!inquiry.read ? { background: "#FFF8F0" } : {}}>
                  <td className="check-col"><input type="checkbox" checked={selected.includes(inquiry._id)} onChange={() => setSelected(selected.includes(inquiry._id) ? selected.filter((id) => id !== inquiry._id) : [...selected, inquiry._id])} /></td>
                  <td><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: inquiry.read ? "#DcdcDC" : "#FF6B00", display: "inline-block" }} /></td>
                  <td className="title-col">
                    <a onClick={() => { setSelectedInquiry(inquiry); if (!inquiry.read) markAsRead(inquiry._id); }} style={{ cursor: "pointer" }}>{inquiry.name}</a>
                  </td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.service || <span style={{ color: "#DcdcDC" }}>—</span>}</td>
                  <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td className="actions-col">
                    <button onClick={() => { setSelectedInquiry(inquiry); if (!inquiry.read) markAsRead(inquiry._id); }} className="admin-btn-ghost admin-btn-sm" title="View"><Eye size={15} /></button>
                    <button onClick={() => handleDelete(inquiry._id)} className="admin-btn-ghost admin-btn-sm" title="Delete" style={{ color: "#DC2626" }}><Trash2 size={15} /></button>
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

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="admin-modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="admin-btn-ghost"><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#F6F7F7", borderRadius: "4px", marginBottom: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FF6B00", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                  {selectedInquiry.name?.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#1D2327" }}>{selectedInquiry.name}</div>
                  <div style={{ fontSize: "13px", color: "#787C82" }}>{selectedInquiry.service || "No service specified"}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#F6F7F7", borderRadius: "4px" }}>
                  <Mail size={16} style={{ color: "#787C82" }} />
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: "#2271B1", textDecoration: "none" }}>{selectedInquiry.email}</a>
                </div>
                {selectedInquiry.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#F6F7F7", borderRadius: "4px" }}>
                    <Phone size={16} style={{ color: "#787C82" }} />
                    <a href={`tel:${selectedInquiry.phone}`} style={{ color: "#2271B1", textDecoration: "none" }}>{selectedInquiry.phone}</a>
                  </div>
                )}
                <div style={{ padding: "14px", background: "#F6F7F7", borderRadius: "4px" }}>
                  <div style={{ fontSize: "12px", color: "#787C82", marginBottom: "6px", fontWeight: 600 }}>Message</div>
                  <p style={{ color: "#1D2327", lineHeight: 1.6 }}>{selectedInquiry.message}</p>
                </div>
                <div style={{ fontSize: "12px", color: "#787C82" }}>
                  Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <a href={`mailto:${selectedInquiry.email}`} className="admin-btn admin-btn-primary">
                <Mail size={14} /> Reply
              </a>
              <button onClick={() => handleDelete(selectedInquiry._id)} className="admin-btn admin-btn-danger">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

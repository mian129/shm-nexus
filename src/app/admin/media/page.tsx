"use client";

import { useState } from "react";
import { Upload, X, Image, File, Film, Music, Trash2, Copy, Grid, List } from "lucide-react";

const mockMedia = [
  { id: "1", name: "hero-bg.jpg", type: "image", size: "2.4 MB", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop", uploaded: "2024-12-01" },
  { id: "2", name: "project-1.png", type: "image", size: "1.8 MB", url: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=400&h=300&fit=crop", uploaded: "2024-12-02" },
  { id: "3", name: "logo-dark.svg", type: "image", size: "12 KB", url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop", uploaded: "2024-12-03" },
  { id: "4", name: "brand-guidelines.pdf", type: "document", size: "4.2 MB", url: "", uploaded: "2024-12-04" },
  { id: "5", name: "promo-video.mp4", type: "video", size: "18 MB", url: "", uploaded: "2024-12-05" },
  { id: "6", name: "testimonial-bg.jpg", type: "image", size: "890 KB", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", uploaded: "2024-12-06" },
  { id: "7", name: "podcast-intro.mp3", type: "audio", size: "3.1 MB", url: "", uploaded: "2024-12-07" },
  { id: "8", name: "team-photo.jpg", type: "image", size: "2.1 MB", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop", uploaded: "2024-12-08" },
];

export default function AdminMedia() {
  const [media, setMedia] = useState(mockMedia);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [notice, setNotice] = useState<{ type: string; msg: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showNotice = (type: string, msg: string) => { setNotice({ type, msg }); setTimeout(() => setNotice(null), 4000); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setMedia((prev) => [{ id: Date.now().toString(), name: file.name, type: file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "audio" : "document", size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, url: data.url, uploaded: new Date().toISOString().split("T")[0] }, ...prev]);
          showNotice("success", `"${file.name}" uploaded.`);
        }
      } catch (err) {
        showNotice("error", `Failed to upload "${file.name}".`);
      }
    }
    setIsUploading(false);
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this media item?")) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    setSelectedMedia(null);
    showNotice("success", "Media deleted.");
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotice("success", "URL copied to clipboard.");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image size={20} />;
      case "video": return <Film size={20} />;
      case "audio": return <Music size={20} />;
      default: return <File size={20} />;
    }
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
        <h1 className="admin-page-title">Media Library</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="admin-btn admin-btn-secondary admin-btn-sm">
            {viewMode === "grid" ? <List size={14} /> : <Grid size={14} />}
          </button>
          <label className="admin-btn admin-btn-orange" style={{ cursor: "pointer" }}>
            <Upload size={16} /> Upload
            <input type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedMedia ? "1fr 340px" : "1fr", gap: "24px" }}>
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          {viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1px", background: "#F0F0F0", padding: "1px" }}>
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  style={{
                    background: "#fff", cursor: "pointer", position: "relative",
                    aspectRatio: "1", overflow: "hidden",
                    outline: selectedMedia?.id === item.id ? "3px solid #FF6B00" : "none",
                  }}
                >
                  {item.url ? (
                    <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#787C82" }}>
                      {getTypeIcon(item.type)}
                      <span style={{ fontSize: "10px", marginTop: "6px" }}>{item.name.split(".").pop()?.toUpperCase()}</span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 8px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", color: "#fff", fontSize: "11px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {media.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedMedia(item)} style={{ cursor: "pointer" }}>
                    <td>
                      <div style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden", background: "#F6F7F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.url ? <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getTypeIcon(item.type)}
                      </div>
                    </td>
                    <td className="title-col">{item.name}</td>
                    <td><span className="admin-badge gray">{item.type}</span></td>
                    <td>{item.size}</td>
                    <td>{item.uploaded}</td>
                    <td className="actions-col">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="admin-btn-ghost admin-btn-sm" style={{ color: "#DC2626" }}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Sidebar */}
        {selectedMedia && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Attachment Details</h3>
              <button onClick={() => setSelectedMedia(null)} className="admin-btn-ghost"><X size={18} /></button>
            </div>
            <div style={{ padding: "16px 0" }}>
              {selectedMedia.url ? (
                <div style={{ marginBottom: "16px", borderRadius: "4px", overflow: "hidden", background: "#F6F7F7" }}>
                  <img src={selectedMedia.url} alt={selectedMedia.name} style={{ width: "100%", display: "block" }} />
                </div>
              ) : (
                <div style={{ marginBottom: "16px", padding: "40px", background: "#F6F7F7", borderRadius: "4px", textAlign: "center", color: "#787C82" }}>
                  {getTypeIcon(selectedMedia.type)}
                  <div style={{ marginTop: "8px", fontSize: "13px" }}>No preview</div>
                </div>
              )}
              <div className="admin-form-group">
                <label className="admin-label">File Name</label>
                <input value={selectedMedia.name} readOnly className="admin-input" style={{ background: "#F6F7F7" }} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Type</label>
                  <input value={selectedMedia.type} readOnly className="admin-input" style={{ background: "#F6F7F7", textTransform: "capitalize" }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Size</label>
                  <input value={selectedMedia.size} readOnly className="admin-input" style={{ background: "#F6F7F7" }} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Date Uploaded</label>
                <input value={selectedMedia.uploaded} readOnly className="admin-input" style={{ background: "#F6F7F7" }} />
              </div>
              {selectedMedia.url && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => copyUrl(selectedMedia.url)} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>
                    <Copy size={14} /> Copy URL
                  </button>
                  <button onClick={() => handleDelete(selectedMedia.id)} className="admin-btn admin-btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

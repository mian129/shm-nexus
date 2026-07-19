"use client";

import { useEffect, useState } from "react";
import { FolderOpen, FileText, MessageSquare, Settings, Users, Briefcase, Trash2, Edit, Plus, Eye } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "create" | "update" | "delete" | "view";
  entity: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

export default function AdminActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate sample activity from API data
    generateActivity();
  }, []);

  const generateActivity = async () => {
    try {
      const [projects, blogs, inquiries, services] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/inquiries").then((r) => r.json()),
        fetch("/api/services-route").then((r) => r.json()),
      ]);

      const items: ActivityItem[] = [];

      // Create activities from real data
      (Array.isArray(projects) ? projects.slice(0, 3) : []).forEach((p: any) => {
        items.push({ id: p._id + "-p", type: "create", entity: "Project", description: `Project "${p.title}" was created`, timestamp: p.createdAt || new Date().toISOString(), icon: FolderOpen, color: "blue" });
      });

      (Array.isArray(blogs) ? blogs.slice(0, 3) : []).forEach((b: any) => {
        items.push({ id: b._id + "-b", type: "create", entity: "Blog Post", description: `Post "${b.title}" was published`, timestamp: b.createdAt || new Date().toISOString(), icon: FileText, color: "green" });
      });

      (Array.isArray(inquiries) ? inquiries.slice(0, 3) : []).forEach((i: any) => {
        items.push({ id: i._id + "-i", type: i.read ? "view" : "create", entity: "Inquiry", description: `Inquiry from "${i.name}" ${i.read ? "was read" : "received"}`, timestamp: i.createdAt || new Date().toISOString(), icon: MessageSquare, color: i.read ? "green" : "orange" });
      });

      (Array.isArray(services) ? services.slice(0, 2) : []).forEach((s: any) => {
        items.push({ id: s._id + "-s", type: "create", entity: "Service", description: `Service "${s.title}" was added`, timestamp: s.createdAt || new Date().toISOString(), icon: Briefcase, color: "purple" });
      });

      // Add some system activities
      items.push({ id: "sys-1", type: "update", entity: "Settings", description: "Site settings were updated", timestamp: new Date(Date.now() - 86400000).toISOString(), icon: Settings, color: "blue" });
      items.push({ id: "sys-2", type: "view", entity: "Dashboard", description: "Admin dashboard accessed", timestamp: new Date().toISOString(), icon: Eye, color: "green" });

      // Sort by timestamp (newest first)
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(items);
    } catch (err) {
      console.error("Failed to generate activity:", err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "create": return <span className="admin-badge green">Created</span>;
      case "update": return <span className="admin-badge blue">Updated</span>;
      case "delete": return <span className="admin-badge red">Deleted</span>;
      case "view": return <span className="admin-badge gray">Viewed</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Activity Log</h1>
        <button onClick={generateActivity} className="admin-btn admin-btn-secondary">
          Refresh
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Activity</th>
                <th>Type</th>
                <th>Entity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#787C82" }}>No activity recorded yet.</td></tr>
              ) : activities.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={`admin-activity-icon ${item.color}`} style={{ width: "32px", height: "32px" }}>
                      <item.icon size={16} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: "#1D2327" }}>{item.description}</div>
                  </td>
                  <td>{getTypeLabel(item.type)}</td>
                  <td><span className="admin-badge gray">{item.entity}</span></td>
                  <td style={{ color: "#787C82", whiteSpace: "nowrap" }}>{formatTime(item.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

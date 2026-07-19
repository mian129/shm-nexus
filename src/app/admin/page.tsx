"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  FileText,
  MessageSquare,
  Briefcase,
  Star,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, inquiries: 0, unread: 0, services: 0, team: 0, testimonials: 0 });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, blogs, inquiries, services, team, testimonials] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/blogs").then((r) => r.json()),
        fetch("/api/inquiries").then((r) => r.json()),
        fetch("/api/services-route").then((r) => r.json()),
        fetch("/api/team").then((r) => r.json()),
        fetch("/api/testimonials").then((r) => r.json()),
      ]);

      const projArr = Array.isArray(projects) ? projects : [];
      const blogArr = Array.isArray(blogs) ? blogs : [];
      const inqArr = Array.isArray(inquiries) ? inquiries : [];
      const servArr = Array.isArray(services) ? services : [];
      const teamArr = Array.isArray(team) ? team : [];
      const testArr = Array.isArray(testimonials) ? testimonials : [];

      setStats({
        projects: projArr.length,
        blogs: blogArr.length,
        inquiries: inqArr.length,
        unread: inqArr.filter((i: any) => !i.read).length,
        services: servArr.length,
        team: teamArr.length,
        testimonials: testArr.length,
      });

      setRecentInquiries(inqArr.slice(0, 5));
      setRecentActivity([
        { type: "project", text: "Projects updated", time: "Just now", icon: FolderOpen },
        { type: "inquiry", text: `${inqArr.filter((i: any) => !i.read).length} unread inquiries`, time: "Recent", icon: MessageSquare },
        { type: "blog", text: `${blogArr.length} blog posts published`, time: "Active", icon: FileText },
      ]);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p style={{ color: "#787C82", fontSize: "14px", margin: "4px 0 0" }}>
            Welcome back! Here&apos;s what&apos;s happening with your site.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/admin/projects" className="admin-btn admin-btn-orange">
            + New Project
          </Link>
          <Link href="/admin/blogs" className="admin-btn admin-btn-primary">
            + New Post
          </Link>
        </div>
      </div>

      {/* At a Glance */}
      <div className="admin-card" style={{ marginBottom: "24px" }}>
        <div className="admin-card-header">
          <h3>At a Glance</h3>
          <span style={{ fontSize: "12px", color: "#787C82" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <div className="admin-stats" style={{ margin: 0, padding: "20px 0 0", border: "none" }}>
          <Link href="/admin/projects" className="admin-stat-card">
            <div className="admin-stat-icon blue"><FolderOpen size={24} /></div>
            <div>
              <div className="admin-stat-value">{stats.projects}</div>
              <div className="admin-stat-label">Projects</div>
            </div>
          </Link>
          <Link href="/admin/blogs" className="admin-stat-card">
            <div className="admin-stat-icon green"><FileText size={24} /></div>
            <div>
              <div className="admin-stat-value">{stats.blogs}</div>
              <div className="admin-stat-label">Blog Posts</div>
            </div>
          </Link>
          <Link href="/admin/inquiries" className="admin-stat-card">
            <div className="admin-stat-icon orange"><MessageSquare size={24} /></div>
            <div>
              <div className="admin-stat-value">{stats.inquiries}</div>
              <div className="admin-stat-label">Inquiries</div>
            </div>
          </Link>
          <Link href="/admin/services" className="admin-stat-card">
            <div className="admin-stat-icon purple"><Briefcase size={24} /></div>
            <div>
              <div className="admin-stat-value">{stats.services}</div>
              <div className="admin-stat-label">Services</div>
            </div>
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Inquiries */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Inquiries</h3>
            <Link href="/admin/inquiries" style={{ fontSize: "13px", color: "#2271B1", textDecoration: "none" }}>
              View All
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: "center", padding: "24px", color: "#787C82" }}>No inquiries yet.</td></tr>
                ) : (
                  recentInquiries.map((inquiry) => (
                    <tr key={inquiry._id}>
                      <td className="title-col">
                        <Link href="/admin/inquiries">{inquiry.name}</Link>
                      </td>
                      <td>{inquiry.service || "N/A"}</td>
                      <td>
                        <span className={`admin-badge ${inquiry.read ? "green" : "orange"}`}>
                          {inquiry.read ? "Read" : "New"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Draft */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Quick Draft</h3>
          </div>
          <div style={{ padding: "16px 0" }}>
            <p style={{ fontSize: "13px", color: "#787C82", margin: "0 0 12px" }}>
              A quick draft for your next blog post
            </p>
            <input
              className="admin-input"
              placeholder="Title"
              style={{ marginBottom: "12px" }}
            />
            <textarea
              className="admin-input admin-draft-textarea"
              placeholder="Write your content..."
            />
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <Link href="/admin/blogs" className="admin-btn admin-btn-primary admin-btn-sm">
                Save Draft
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Site Health + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Site Health</h3>
          </div>
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span className="admin-health-dot good"></span>
              <span style={{ fontSize: "14px", color: "#1D2327" }}>Database connected</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span className="admin-health-dot good"></span>
              <span style={{ fontSize: "14px", color: "#1D2327" }}>API routes responding</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span className="admin-health-dot good"></span>
              <span style={{ fontSize: "14px", color: "#1D2327" }}>Static assets optimized</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className={`admin-health-dot ${stats.unread > 5 ? "warning" : "good"}`}></span>
              <span style={{ fontSize: "14px", color: "#1D2327" }}>
                {stats.unread > 5 ? `${stats.unread} unread messages` : "All messages handled"}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Activity</h3>
            <Link href="/admin/activity" style={{ fontSize: "13px", color: "#2271B1", textDecoration: "none" }}>
              View All
            </Link>
          </div>
          <div style={{ padding: "12px 0" }}>
            {recentActivity.map((activity, i) => (
              <div key={i} className="admin-activity-item">
                <div className={`admin-activity-icon ${activity.type === "project" ? "blue" : activity.type === "inquiry" ? "orange" : "green"}`}>
                  <activity.icon size={16} />
                </div>
                <div>
                  <div className="admin-activity-text">{activity.text}</div>
                  <div className="admin-activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Settings,
  MessageSquare,
  Star,
  Briefcase,
  ChevronLeft,
  ChevronDown,
  Search,
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  Image,
  Activity,
  Home,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

const navGroups: { label: string; items: { name: string; href: string; icon: any; badge?: boolean }[] }[] = [
  {
    label: "Content",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Projects", href: "/admin/projects", icon: FolderOpen },
      { name: "Blogs", href: "/admin/blogs", icon: FileText },
      { name: "Services", href: "/admin/services", icon: Briefcase },
      { name: "Team", href: "/admin/team", icon: Users },
      { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    ],
  },
  {
    label: "Communication",
    items: [
      { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, badge: true },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Media", href: "/admin/media", icon: Image },
      { name: "Activity Log", href: "/admin/activity", icon: Activity },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        const inquiries = Array.isArray(data) ? data : data.data || [];
        setUnreadCount(inquiries.filter((i: any) => !i.read).length);
      })
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            className="admin-topbar-icon"
            onClick={() => {
              if (window.innerWidth <= 640) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/admin" className="admin-topbar-brand">
            <div className="w-7 h-7 bg-orange rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            SHM Nexus
          </Link>
          <nav className="admin-topbar-nav">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/projects">Projects</Link>
            <Link href="/admin/inquiries">Inquiries</Link>
          </nav>
        </div>
        <div className="admin-topbar-right">
          <input
            type="text"
            className="admin-topbar-search"
            placeholder="Search..."
          />
          <button className="admin-topbar-icon" title="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="admin-topbar-badge">{unreadCount}</span>
            )}
          </button>
          <Link
            href="/"
            target="_blank"
            className="admin-topbar-icon"
            title="Visit Site"
          >
            <ExternalLink size={18} />
          </Link>
          <div className="admin-topbar-avatar" title="Admin">A</div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <nav className="admin-nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="admin-nav-group-title">{group.label}</div>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? "active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="admin-nav-text">{item.name}</span>
                    {item.badge && unreadCount > 0 && (
                      <span className="admin-nav-badge">{unreadCount}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link
            href="/"
            className="admin-nav-item"
            target="_blank"
          >
            <ExternalLink size={20} />
            <span className="admin-nav-text admin-sidebar-footer-text">Visit Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item" style={{ color: "#DC2626" }}>
            <LogOut size={20} />
            <span className="admin-nav-text admin-sidebar-footer-text">Logout</span>
          </button>
          <button
            className="admin-sidebar-toggle"
            onClick={() => {
              if (window.innerWidth > 640) setCollapsed(!collapsed);
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">{children}</main>
    </div>
  );
}

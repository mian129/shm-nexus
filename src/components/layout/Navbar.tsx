"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const LogoSVG = () => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M183.72,232.02c-28.68,0-52.01-23.33-52.01-52.01h23.43c0,15.76,12.82,28.58,28.58,28.58s28.58-12.82,28.58-28.58h23.43c0,28.68-23.33,52.01-52.01,52.01Z"/>
    <path d="M72.28,180.01c-28.68,0-52.01-23.33-52.01-52.01s23.33-52.01,52.01-52.01,52.01,23.33,52.01,52.01-23.33,52.01-52.01,52.01ZM72.28,99.42c-15.76,0-28.58,12.82-28.58,28.58s12.82,28.58,28.58,28.58,28.58-12.82,28.58-28.58-12.82-28.58-28.58-28.58Z"/>
    <path d="M183.72,180.01c-28.68,0-52.01-23.33-52.01-52.01s23.33-52.01,52.01-52.01,52.01,23.33,52.01,52.01-23.33,52.01-52.01,52.01ZM183.72,99.42c-15.76,0-28.58,12.82-28.58,28.58s12.82,28.58,28.58,28.58,28.58-12.82,28.58-28.58-12.82-28.58-28.58-28.58Z"/>
    <circle cx="98.28" cy="49.99" r="26"/>
  </svg>
);

function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as "dark" | "light" | null;
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
        return saved;
      }
    }
    return "dark";
  });
  const setTheme = useCallback((next: "dark" | "light") => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }, []);
  return [theme, setTheme] as const;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ===== DESKTOP HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden lg:block nav-slide-down" style={{ background: "transparent" }}>
        <div className="container-custom flex items-center justify-between h-20">
          <Link href="/" className="nav-logo-shapes group w-14 h-14">
            <LogoSVG />
          </Link>
          <div className="flex items-center gap-5">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="theme-toggle" aria-label="Toggle theme">
              <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="22" height="22">
                <path d="M9.05,18.4l-2.08,1.12c-.9.49-2.01-.05-2.19-1.05l-.42-2.33c-.12-.66-.56-1.22-1.19-1.49l-2.18-.93c-.94-.4-1.21-1.6-.54-2.37l1.56-1.78c.44-.51.6-1.2.42-1.85l-.63-2.28c-.27-.98.5-1.95,1.51-1.9l2.36.11c.67.03,1.32-.28,1.71-.82l1.39-1.91c.6-.83,1.83-.83,2.43,0l1.39,1.91c.4.55,1.04.86,1.71.82l2.36-.11c1.02-.05,1.79.92,1.51,1.9l-.63,2.28c-.18.65-.02,1.35.42,1.85l1.56,1.78c.67.77.4,1.97-.54,2.37l-2.18.93c-.62.26-1.07.82-1.19,1.49l-.42,2.33c-.18,1-1.29,1.54-2.19,1.05l-2.08-1.12c-.59-.32-1.31-.32-1.9,0Z" fill="currentColor"/>
              </svg>
              <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18">
                <path d="M11.89,9.44c-1.59-2.48-2.54-5.19-2.91-7.93-.14-1.09-1.32-1.74-2.27-1.19-.3.17-.6.36-.9.57C1.41,4,.12,10.19,2.9,14.81c3.05,5.07,9.66,6.59,14.61,3.42.13-.08.26-.17.39-.26.92-.65.87-2-.08-2.6-2.32-1.47-4.36-3.46-5.94-5.93Z" fill="currentColor"/>
              </svg>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" style={{ color: "var(--text-primary)" }}>
                <circle cx="14" cy="14" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="34" cy="14" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[-20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="34" cy="34" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[-20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="14" cy="34" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[20px] opacity-0' : ''}`} fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE TOP NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden nav-slide-down" style={{ background: "transparent" }}>
        <div className="container-custom flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="nav-logo-shapes w-9 h-9">
              <LogoSVG />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="theme-toggle" aria-label="Toggle theme">
              <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18">
                <path d="M9.05,18.4l-2.08,1.12c-.9.49-2.01-.05-2.19-1.05l-.42-2.33c-.12-.66-.56-1.22-1.19-1.49l-2.18-.93c-.94-.4-1.21-1.6-.54-2.37l1.56-1.78c.44-.51.6-1.2.42-1.85l-.63-2.28c-.27-.98.5-1.95,1.51-1.9l2.36.11c.67.03,1.32-.28,1.71-.82l1.39-1.91c.6-.83,1.83-.83,2.43,0l1.39,1.91c.4.55,1.04.86,1.71.82l2.36-.11c1.02-.05,1.79.92,1.51,1.9l-.63,2.28c-.18.65-.02,1.35.42,1.85l1.56,1.78c.67.77.4,1.97-.54,2.37l-2.18.93c-.62.26-1.07.82-1.19,1.49l-.42,2.33c-.18,1-1.29,1.54-2.19,1.05l-2.08-1.12c-.59-.32-1.31-.32-1.9,0Z" fill="currentColor"/>
              </svg>
              <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18">
                <path d="M11.89,9.44c-1.59-2.48-2.54-5.19-2.91-7.93-.14-1.09-1.32-1.74-2.27-1.19-.3.17-.6.36-.9.57C1.41,4,.12,10.19,2.9,14.81c3.05,5.07,9.66,6.59,14.61,3.42.13-.08.26-.17.39-.26.92-.65.87-2-.08-2.6-2.32-1.47-4.36-3.46-5.94-5.93Z" fill="currentColor"/>
              </svg>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" style={{ color: "var(--text-primary)" }}>
                <circle cx="14" cy="14" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="34" cy="14" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[-20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="34" cy="34" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[-20px] opacity-0' : ''}`} fill="currentColor"/>
                <circle cx="14" cy="34" r="7" className={`transition-all duration-500 ${isOpen ? 'translate-x-[20px] opacity-0' : ''}`} fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto mobile-menu-enter" style={{ background: "var(--bg-primary)" }}>
          {/* Header */}
          <div className="container-custom flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
              <div className="nav-logo-shapes w-9 h-9">
                <LogoSVG />
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="theme-toggle" aria-label="Toggle theme">
                <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18">
                  <path d="M9.05,18.4l-2.08,1.12c-.9.49-2.01-.05-2.19-1.05l-.42-2.33c-.12-.66-.56-1.22-1.19-1.49l-2.18-.93c-.94-.4-1.21-1.6-.54-2.37l1.56-1.78c.44-.51.6-1.2.42-1.85l-.63-2.28c-.27-.98.5-1.95,1.51-1.9l2.36.11c.67.03,1.32-.28,1.71-.82l1.39-1.91c.6-.83,1.83-.83,2.43,0l1.39,1.91c.4.55,1.04.86,1.71.82l2.36-.11c1.02-.05,1.79.92,1.51,1.9l-.63,2.28c-.18.65-.02,1.35.42,1.85l1.56,1.78c.67.77.4,1.97-.54,2.37l-2.18.93c-.62.26-1.07.82-1.19,1.49l-.42,2.33c-.18,1-1.29,1.54-2.19,1.05l-2.08-1.12c-.59-.32-1.31-.32-1.9,0Z" fill="currentColor"/>
                </svg>
                <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="22" height="22">
                  <path d="M11.89,9.44c-1.59-2.48-2.54-5.19-2.91-7.93-.14-1.09-1.32-1.74-2.27-1.19-.3.17-.6.36-.9.57C1.41,4,.12,10.19,2.9,14.81c3.05,5.07,9.66,6.59,14.61,3.42.13-.08.26-.17.39-.26.92-.65.87-2-.08-2.6-2.32-1.47-4.36-3.46-5.94-5.93Z" fill="currentColor"/>
                </svg>
              </button>
              <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11" style={{ color: "var(--text-primary)" }}>
                  <circle cx="14" cy="14" r="7" fill="currentColor"/>
                  <circle cx="34" cy="14" r="7" fill="currentColor"/>
                  <circle cx="34" cy="34" r="7" fill="currentColor"/>
                  <circle cx="14" cy="34" r="7" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="container-custom py-8">
            <nav className="space-y-2">
              {navLinks.map((link, index) => (
                <div
                  key={link.name}
                  className="mobile-menu-item"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 py-4 text-4xl font-bold transition-all ${
                      pathname === link.href ? "text-orange" : ""
                    }`}
                    style={{ color: pathname === link.href ? undefined : "var(--text-primary)" }}
                  >
                    <span className="w-3 h-3 rounded-sm bg-current flex-shrink-0"/>
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="container-custom py-8 border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex items-center gap-4 mb-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-secondary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-secondary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-secondary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Designed & Developed by SHM Nexus
            </p>
          </div>
        </div>
      )}
    </>
  );
}

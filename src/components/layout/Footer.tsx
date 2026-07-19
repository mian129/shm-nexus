"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 py-16 mt-20 border-t" style={{ borderColor: "var(--border-color)" }}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="nav-logo-shapes">
              <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path d="M183.72,232.02c-28.68,0-52.01-23.33-52.01-52.01h23.43c0,15.76,12.82,28.58,28.58,28.58s28.58-12.82,28.58-28.58h23.43c0,28.68-23.33,52.01-52.01,52.01Z"/>
                <path d="M72.28,180.01c-28.68,0-52.01-23.33-52.01-52.01s23.33-52.01,52.01-52.01,52.01,23.33,52.01,52.01-23.33,52.01-52.01,52.01ZM72.28,99.42c-15.76,0-28.58,12.82-28.58,28.58s12.82,28.58,28.58,28.58,28.58-12.82,28.58-28.58-12.82-28.58-28.58-28.58Z"/>
                <path d="M183.72,180.01c-28.68,0-52.01-23.33-52.01-52.01s23.33-52.01,52.01-52.01,52.01,23.33,52.01,52.01-23.33,52.01-52.01,52.01ZM183.72,99.42c-15.76,0-28.58,12.82-28.58,28.58s12.82,28.58,28.58,28.58,28.58-12.82,28.58-28.58-12.82-28.58-28.58-28.58Z"/>
                <circle cx="98.28" cy="49.99" r="26"/>
              </svg>
            </Link>
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>SHM <span className="text-orange">Nexus</span></p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Designed & Developed by SHM Nexus</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-orange/10 hover:text-orange" style={{ color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

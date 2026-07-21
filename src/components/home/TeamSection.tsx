"use client";

import { useEffect, useState } from "react";

export default function TeamSection() {
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setTeam(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (team.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Meet The Team
          </h2>
          <p className="text-lg mt-4 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            The people behind SHM Nexus — passionate about creating digital excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member._id} className="card group text-center overflow-hidden"
              style={{ transition: "transform 0.3s ease", background: "var(--bg-card)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div className="w-28 h-28 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)", border: "3px solid var(--border-color)", flexShrink: 0 }}>
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} loading="lazy" className="w-full h-full object-cover" style={{ borderRadius: "50%" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-orange">
                      {member.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-base mb-1 group-hover:text-orange transition-colors" style={{ color: "var(--text-primary)" }}>
                {member.name}
              </h3>
              <p className="text-xs font-medium text-orange mb-3">{member.designation}</p>
              {member.bio && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {member.bio.length > 120 ? member.bio.slice(0, 120) + "..." : member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code, Search, Palette, TrendingUp, Share2, PenTool, Video, Target, Megaphone, Star } from "lucide-react";

const iconMap: Record<string, any> = {
  Code, Search, Palette, TrendingUp, Share2, PenTool, Video, Target, Megaphone, Star,
};

const fallbackServices = [
  { _id: "1", icon: "Code", title: "Web Development", description: "Custom websites built with modern technologies that convert visitors into customers." },
  { _id: "2", icon: "Search", title: "SEO Optimization", description: "Data-driven SEO strategies to rank #1 on Google and drive organic traffic." },
  { _id: "3", icon: "Star", title: "Reviews & Rating", description: "Build trust online with authentic reviews and reputation management." },
  { _id: "4", icon: "Palette", title: "Graphic Design", description: "Stunning visuals that capture attention and communicate your brand story." },
  { _id: "5", icon: "TrendingUp", title: "Google Ranking", description: "Dominate search results with proven ranking strategies." },
  { _id: "6", icon: "Share2", title: "Social Media", description: "Engage audiences and grow your brand across all platforms." },
  { _id: "7", icon: "PenTool", title: "Content Writing", description: "Compelling copy and content that resonates with your audience." },
  { _id: "8", icon: "Video", title: "Video Editing", description: "Professional video content that tells your brand story." },
  { _id: "9", icon: "Target", title: "Brand Identity", description: "Memorable brands that stand out from the competition." },
  { _id: "10", icon: "Megaphone", title: "Google Ads", description: "Maximize ROI with targeted pay-per-click advertising." },
];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>(fallbackServices);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("/api/services-route", { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {});

    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Our Services
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComp = iconMap[service.icon] || Code;
              return (
                <Link key={service._id || service.title} href={`/contact?service=${encodeURIComponent(service.title)}`}>
                  <div className="card group cursor-pointer h-full" style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300" style={{ background: "var(--bg-hover)" }}>
                      <IconComp className="text-orange" size={20} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5 group-hover:text-orange transition-colors" style={{ color: "var(--text-primary)" }}>
                      {service.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

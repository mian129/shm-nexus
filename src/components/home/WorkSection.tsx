"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function WorkSection() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 9) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="works" className="section-padding">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Selected Works
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
            style={{ color: "var(--text-secondary)" }}
          >
            View All
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id || project.slug} className="group cursor-pointer"
              style={{ transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden mb-4">
                  <div className="col-span-2 aspect-[16/9] overflow-hidden">
                    <img
                      src={project.images?.[0] || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={project.images?.[1] || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={project.images?.[2] || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
                <span className="text-orange text-xs font-semibold uppercase tracking-wider">{project.category}</span>
                <h3 className="text-lg font-semibold mt-1 group-hover:text-orange transition-colors" style={{ color: "var(--text-primary)" }}>
                  {project.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/projects" className="btn-primary">
            View All Projects <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

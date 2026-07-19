"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-16" style={{ color: "var(--text-primary)" }}>
              Selected Works
            </h1>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ScrollReveal key={project._id || project.slug} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                      <img
                        src={project.images?.[0] || "/placeholder.jpg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <ArrowUpRight size={18} className="text-charcoal" />
                        </div>
                      </div>
                    </div>
                    <span className="text-orange text-xs font-semibold uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-lg font-semibold mt-1 group-hover:text-orange transition-colors" style={{ color: "var(--text-primary)" }}>
                      {project.title}
                    </h3>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

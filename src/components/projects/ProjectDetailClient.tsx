"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ProjectDetailClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/projects/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
        fetch(`/api/projects?category=${encodeURIComponent(data.category)}`)
          .then((r) => r.json())
          .then((all) => {
            if (Array.isArray(all)) {
              setRelated(all.filter((p: any) => p.slug !== slug).slice(0, 3));
            }
          });
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Project Not Found</h1>
          <Link href="/projects" className="btn-primary">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <section className="relative pt-32 pb-16">
        <div className="container-custom">
          <ScrollReveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors group"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              All Projects
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <span className="text-orange text-sm font-semibold uppercase tracking-wider">{project.category}</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
              {project.title}
            </h1>
            <p className="text-xl max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              {project.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-8 mt-10 py-8 border-t" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Client</span>
                <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{project.client || "—"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Year</span>
                <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{project.year || "—"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-tertiary)" }}>Category</span>
                <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{project.category}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-600">
              <img
                src={project.images?.[0] || "/placeholder.jpg"}
                alt={project.title}
                loading="lazy"
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {project.details && project.details.length > 0 && (
        <section className="pb-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <ScrollReveal>
                <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>What We Did</h2>
                <ul className="space-y-4">
                  {project.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-orange/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-orange" />
                      </div>
                      <span className="text-lg" style={{ color: "var(--text-secondary)" }}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <div className="space-y-4">
                <ScrollReveal delay={0.1}>
                  <div className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-600">
                    <img
                      src={project.images?.[1] || "/placeholder.jpg"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-600">
                    <img
                      src={project.images?.[2] || "/placeholder.jpg"}
                      alt={project.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="pb-20">
          <div className="container-custom">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)" }}>Related Projects</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel: any, i: number) => (
                <ScrollReveal key={rel.slug} delay={i * 0.1}>
                  <div className="group cursor-pointer hover:-translate-y-2 transition-transform duration-400">
                    <Link href={`/projects/${rel.slug}`}>
                      <div className="rounded-2xl overflow-hidden mb-4">
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={rel.images?.[0] || "/placeholder.jpg"}
                            alt={rel.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </div>
                      </div>
                      <span className="text-orange text-xs font-semibold uppercase tracking-wider">{rel.category}</span>
                      <h3 className="text-lg font-semibold mt-1 group-hover:text-orange transition-colors" style={{ color: "var(--text-primary)" }}>
                        {rel.title}
                      </h3>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center py-16 rounded-3xl" style={{ background: "var(--bg-secondary)" }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                Like What You See?
              </h2>
              <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                Let&apos;s discuss your next project and bring your vision to life.
              </p>
              <Link href="/contact" className="btn-primary">
                Start a Project <ArrowUpRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/animations/ScrollReveal";

const services = [
  "Web Development",
  "SEO Optimization",
  "Reviews & Rating",
  "Graphic Design",
  "Google Ranking",
  "Social Media",
  "Content Writing",
  "Video Editing",
  "Brand Identity",
  "Google Ads",
  "Other",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    if (initialService) {
      setForm((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.company ? `[Company: ${form.company}] ${form.message}` : form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl">
            <ScrollReveal>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-16" style={{ color: "var(--text-primary)" }}>
                Contact
              </h1>
            </ScrollReveal>

            {submitted ? (
              <ScrollReveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <CheckCircle className="text-orange mx-auto mb-6" size={48} />
                  <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Thanks!</h2>
                  <p style={{ color: "var(--text-secondary)" }}>Your message has been sent. We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", company: "", email: "", phone: "", service: "", message: "" }); }}
                    className="mt-6 btn-secondary"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              </ScrollReveal>
            ) : (
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Company (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Company name"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Phone (optional)</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+92 300 1234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Service *</label>
                    <select
                      required
                      className="form-input"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Message *</label>
                    <textarea
                      required
                      rows={5}
                      className="form-input resize-none"
                      placeholder="Tell us about your project..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Sending..." : <>Submit <Send size={16} /></>}
                  </button>
                </form>

                <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
                  or <a href="mailto:shmnexus@gmail.com" className="text-orange hover:underline">email me</a>
                </p>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div />}>
      <ContactForm />
    </Suspense>
  );
}

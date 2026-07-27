"use client";

import { useState, useEffect } from "react";
import { Target, Eye, Heart } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const defaultTeam = [
  { name: "Muhammad Muneeb", designation: "CEO & Founder, SEO Specialist", bio: "Visionary leader and SEO specialist with a passion for driving digital growth. Muhammad founded SHM Nexus with the mission to help businesses thrive online through data-driven strategies and innovative solutions.", photo: "" },
  { name: "Hanan Mehmood", designation: "Co-Founder, HR & Lead Generation Expert", bio: "Strategic mind behind SHM Nexus's lead generation engine. Hanan specializes in identifying high-value opportunities and building systems that consistently deliver quality leads.", photo: "" },
  { name: "Subhan Ali", designation: "Co-Founder, Web Developer & Python Expert", bio: "Full-stack developer and Python expert who brings ideas to life through clean, efficient code. Subhan architects and builds scalable web applications that power SHM Nexus's client projects.", photo: "" },
  { name: "Hussnain Amir", designation: "Co-Founder, Digital Marketing Head & Creative Head", bio: "Creative strategist with an eye for compelling campaigns. Hussnain leads SHM Nexus's digital marketing efforts, blending data analytics with creative storytelling.", photo: "" },
];

const values = [
  { icon: Target, title: "Our Mission", description: "To empower businesses with innovative digital solutions that drive growth, engagement, and success in the online world." },
  { icon: Eye, title: "Our Vision", description: "To become the leading digital agency in Pakistan, known for creativity, quality, and delivering exceptional results." },
  { icon: Heart, title: "Our Values", description: "Integrity, Innovation, Quality, and Client Satisfaction are at the heart of everything we do." },
];

export default function AboutPage() {
  const [team, setTeam] = useState(defaultTeam);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative pb-20" style={{ background: "var(--bg-primary)", paddingTop: "140px" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-orange font-medium uppercase tracking-wider text-sm">About Us</span>
              <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
                We Are <span className="text-orange">SHM Nexus</span>
              </h1>
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                A team of passionate digital professionals dedicated to helping businesses grow online.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding" style={{ background: "var(--bg-secondary)" }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <span className="text-orange font-medium uppercase tracking-wider text-sm">Our Story</span>
                <h2 className="text-4xl font-bold mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
                  Who We Are
                </h2>
                <p className="mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  SHM Nexus was founded with a simple idea: to help businesses succeed in the digital world.
                  What started as a small team of 4 friends has grown into a full-service digital agency
                  serving clients across Pakistan and beyond.
                </p>
                <p className="mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  We believe that every business deserves a strong online presence. That&apos;s why we offer
                  comprehensive services from web development and SEO to graphic design and social media marketing.
                </p>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Our approach is simple: listen to our clients, understand their goals, and deliver solutions
                  that exceed expectations. We measure our success by the success of our clients.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="rounded-2xl p-6 text-center transition-all duration-300 group"
                    style={{ background: "var(--bg-card)" }}
                  >
                    <value.icon className="text-orange mx-auto mb-4" size={32} />
                    <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{value.title}</h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{value.description}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-orange font-medium uppercase tracking-wider text-sm">Our Team</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6" style={{ color: "var(--text-primary)" }}>
                Meet The <span className="text-orange">Team</span>
              </h2>
              <p style={{ color: "var(--text-secondary)" }} className="max-w-2xl mx-auto">
                Four friends with a shared vision of helping businesses succeed in the digital world.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {team.map((member: any, index: number) => (
              <ScrollReveal key={member._id || member.name} delay={index * 0.15}>
                <div
                  className="rounded-3xl overflow-hidden transition-all duration-300 group h-full flex flex-col hover:-translate-y-2"
                  style={{ background: "var(--bg-card)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
                >
                  <div className="relative overflow-hidden" style={{ paddingBottom: "110%" }}>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-orange to-orange-dark">
                        <span className="text-5xl font-bold text-white/30">
                          {member.name.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
                    <p className="text-orange text-xs font-semibold mb-3 uppercase tracking-wider">{member.designation}</p>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{member.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding" style={{ background: "var(--bg-secondary)" }}>
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-orange mb-2">5+</div>
                <p style={{ color: "var(--text-secondary)" }}>Years Experience</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">150+</div>
                <p style={{ color: "var(--text-secondary)" }}>Projects Done</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">100+</div>
                <p style={{ color: "var(--text-secondary)" }}>Happy Clients</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">10+</div>
                <p style={{ color: "var(--text-secondary)" }}>Services</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

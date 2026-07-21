"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Marquee from "@/components/animations/Marquee";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Top Marquee */}
      <div className="pt-24 lg:pt-0 lg:mt-24">
        <Marquee />
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full text-center px-4">
          <div className="hero-fade-up">
            <h1
              className="font-bold leading-[0.9] tracking-[-0.05em] mb-8"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(3rem, 12vw, 10rem)",
              }}
            >
              <span className="block">We Build</span>
              <span className="block text-orange">Digital</span>
              <span className="block">Products</span>
            </h1>
          </div>

          <div className="hero-fade-up-delay flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/projects" className="btn-primary">
              see my work <ArrowUpRight size={16} />
            </Link>
            <Link href="/contact" className="btn-secondary">
              get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="pb-8">
        <Marquee />
      </div>
    </section>
  );
}

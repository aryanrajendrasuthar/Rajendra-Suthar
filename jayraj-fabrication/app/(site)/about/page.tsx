/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import type { Metadata } from "next";
import { Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Jayraj Fabrication",
  description: "16+ years of industrial fabrication excellence. Founded 2008, Vadodara. PEB structures, roofing, tensile across India.",
};

const TIMELINE = [
  { year: "2008", title: "Founded", desc: "Jayraj Fabrication established in Vadodara, Gujarat." },
  { year: "2010", title: "First Major Project", desc: "Secured first large-scale commercial roofing contract." },
  { year: "2014", title: "Industrial Division", desc: "Expanded into industrial shed and factory structures." },
  { year: "2018", title: "Tensile Division", desc: "Launched tensile membrane and canopy fabrication." },
  { year: "2021", title: "PEB Structures", desc: "Began delivering pre-engineered building solutions." },
  { year: "2025", title: "200+ Projects", desc: "Crossed 200 delivered projects across 15+ cities." },
];

const SAFETY_PILLARS = [
  { icon: Shield, title: "Zero Compromise", desc: "Every site operates on documented safety protocols. No shortcuts." },
  { icon: Zap, title: "Trained Teams", desc: "All erection teams trained in working at heights and heavy equipment." },
  { icon: Globe, title: "Pan-India Standards", desc: "We follow IS and BIS codes across all projects nationwide." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-jf-bg pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-jf-bg-section py-20 border-b border-white/10">
        <span className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[200px] font-bold leading-none text-white/[0.02]">
          ABOUT
        </span>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="section-label mb-3">About Us</p>
          <h1 className="section-heading text-white max-w-2xl">
            BUILDING INDIA FOR 16+ YEARS
          </h1>
          <p className="section-subheading mt-5">
            Jayraj Fabrication has been delivering industrial PEB structures, tensile solutions, and premium roofing across India since 2008. Founded on the principles of quality, reliability, and transparency.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 text-white/60 leading-relaxed">
            <h2 className="font-heading text-3xl font-bold text-white">Our Story</h2>
            <p>
              Founded in 2008 by Rajendra Suthar in Vadodara, Gujarat, Jayraj Fabrication began as a small roofing contractor with a single mission: to deliver quality that speaks for itself.
            </p>
            <p>
              Over 16 years, we have evolved into a full-service industrial fabrication company — handling everything from pre-engineered steel buildings to tensile membrane canopies, ACP façades to colour-coated roofing sheets.
            </p>
            <p>
              Today, we operate from two offices — our headquarters in Vadodara and a branch in Surat — and have delivered projects across Gujarat, Maharashtra, Karnataka, Rajasthan, and beyond.
            </p>
            <p>
              What sets us apart is simple: we own the entire process. From structural design to final erection, one team, full accountability, zero handoffs.
            </p>
          </div>

          {/* Leadership */}
          <div className="flex flex-col gap-6">
            <div className="admin-card flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-jf-lime bg-jf-bg-3">
                {/* Profile photo — add rajendra-suthar.jpg to public/images/team/ */}
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-2xl font-bold text-jf-lime">RS</span>
                </div>
              </div>
              <div>
                <div className="font-heading text-lg font-bold text-white">Rajendra Suthar</div>
                <div className="text-sm text-jf-lime">Founder & Director</div>
                <div className="mt-1.5 text-sm text-white/50">
                  16+ years in steel fabrication and industrial construction across India.
                </div>
              </div>
            </div>

            {/* India presence map placeholder */}
            <div className="admin-card flex flex-col gap-3">
              <h3 className="font-heading font-semibold text-white">Pan-India Presence</h3>
              <div className="flex flex-wrap gap-2">
                {["Vadodara", "Surat", "Ahmedabad", "Mumbai", "Vapi", "Silvassa", "Hazira", "Bengaluru", "Jaipur"].map((city) => (
                  <span key={city} className="rounded-full border border-jf-lime/30 bg-jf-lime/10 px-3 py-1 text-xs text-jf-lime">
                    {city}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/30">and 6+ more cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-jf-bg-section py-20 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white mb-10">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10 hidden sm:block" />
            <div className="space-y-8">
              {TIMELINE.map((t) => (
                <div key={t.year} className="flex items-start gap-6">
                  <div className="shrink-0 font-mono-jf text-sm font-bold text-jf-lime w-12 text-right">{t.year}</div>
                  <div className="relative shrink-0 hidden sm:block">
                    <div className="h-3 w-3 rounded-full border-2 border-jf-lime bg-jf-bg-section mt-1" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-white">{t.title}</div>
                    <div className="text-sm text-white/50">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10">
          <p className="section-label mb-3">Safety</p>
          <h2 className="font-heading text-3xl font-bold text-white">Safety is Non-Negotiable</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {SAFETY_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="admin-card space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jf-lime/10 border border-jf-lime/20">
                  <Icon className="h-5 w-5 text-jf-lime" />
                </div>
                <div className="font-heading font-semibold text-white">{p.title}</div>
                <p className="text-sm text-white/50">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/10 bg-jf-bg-section py-16 text-center">
        <p className="section-label mb-3">Work with us</p>
        <h2 className="font-heading text-3xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
        <Link href="/contact" className="btn-lime px-8 py-3.5 text-base">
          Get in Touch →
        </Link>
      </div>
    </div>
  );
}

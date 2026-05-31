import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-jf-bg">
      {/* Hero background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        autoPlay muted loop playsInline
        poster="/images/hero/hero-poster.jpg"
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-jf-bg/85 via-jf-bg/60 to-jf-bg/85" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#6BBF3A 1px, transparent 1px), linear-gradient(90deg, #6BBF3A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Lime accent line — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jf-lime/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-24 pb-20 lg:px-8">
        {/* Logo mark */}
        <div className="mb-8">
          <Image
            src="/logo/jf-logo.jpeg"
            alt="Jayraj Fabrication"
            width={180}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* Eyebrow */}
        <p className="section-label mb-4 animate-fade-up">
          — ROOFING SOLUTIONS UNDER ONE ROOF —
        </p>

        {/* H1 */}
        <h1 className="font-display font-bold uppercase leading-none">
          <span
            className="block text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            BUILDING INDIA&apos;S
          </span>
          <span
            className="block text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            INDUSTRIAL FUTURE
          </span>
          <span
            className="block text-jf-lime"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            SINCE 2008
          </span>
        </h1>

        {/* Subline */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          From concept to erection — PEB structures, tensile fabrication, roofing solutions
          across India. Delivered on time, without compromise.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-lg bg-jf-lime px-6 py-3.5 font-semibold text-black transition-all hover:bg-jf-lime-glow hover:scale-105 active:scale-95"
          >
            VIEW OUR WORK
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 font-semibold text-white transition-all hover:border-white/60 hover:bg-white/5"
          >
            GET A QUOTE
          </Link>
        </div>

        {/* Stats teaser */}
        <div className="mt-16 flex flex-wrap gap-8">
          {[
            { num: "16+", label: "Years" },
            { num: "200+", label: "Projects" },
            { num: "80+", label: "Clients" },
            { num: "15+", label: "Cities" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-bold text-jf-lime">{s.num}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce-dot" />
      </div>
    </section>
  );
}

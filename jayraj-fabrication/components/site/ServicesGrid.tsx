import Link from "next/link";
import { Building2, Layers, Triangle, Layout, Store, Home, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    no: "01", slug: "industrial-peb",
    title: "Industrial & PEB Structures",
    desc: "Prefabricated steel buildings & warehouses",
    icon: Building2,
    detail: "Engineered structural steel buildings for industrial, commercial, and warehouse applications. Designed for speed, strength, and cost efficiency.",
  },
  {
    no: "02", slug: "roofing",
    title: "Roofing Solutions",
    desc: "PPGI/PPGL, Galvalume, Polycarbonate sheets",
    icon: Layers,
    detail: "Comprehensive roofing systems — colour-coated, Galvalume, polycarbonate, and metal deck sheets for every requirement.",
  },
  {
    no: "03", slug: "tensile",
    title: "Tensile Fabrication",
    desc: "Tensile canopies & membrane structures",
    icon: Triangle,
    detail: "Architecturally striking tensile membrane structures for commercial, recreational, and landmark projects.",
  },
  {
    no: "04", slug: "elevation-facade",
    title: "Building Elevation & Façade",
    desc: "ACP cladding & exterior systems",
    icon: Layout,
    detail: "Premium ACP cladding, glass facades, and exterior finishing systems that transform building aesthetics.",
  },
  {
    no: "05", slug: "commercial",
    title: "Commercial Buildings",
    desc: "Malls, complexes & commercial spaces",
    icon: Store,
    detail: "Complete structural and façade solutions for malls, commercial complexes, and shopfronts across India.",
  },
  {
    no: "06", slug: "residential",
    title: "Residential Projects",
    desc: "Custom residential roofing solutions",
    icon: Home,
    detail: "Tailored roofing and structural solutions for bungalows, villas, and residential societies.",
  },
];

export default function ServicesGrid() {
  return (
    <section className="relative bg-jf-bg py-24 overflow-hidden">
      {/* Section watermark */}
      <span className="pointer-events-none absolute -top-4 left-0 select-none font-display text-[200px] font-bold leading-none text-jf-bg-3 opacity-60">
        01
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12">
          <p className="section-label mb-3">Services</p>
          <h2 className="section-heading text-white">WHAT WE BUILD</h2>
          <p className="section-subheading mt-4">
            End-to-end fabrication solutions for every scale of project
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                href={`/services#${s.slug}`}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-jf-bg-2 p-6 transition-all duration-300 hover:border-jf-lime/50 hover:bg-jf-bg-3 hover:shadow-[0_0_30px_rgba(107,191,58,0.1)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-jf-bg-3 transition-all group-hover:border-jf-lime/30 group-hover:bg-jf-lime/10">
                    <Icon className="h-5 w-5 text-jf-lime" />
                  </div>
                  <span className="font-mono-jf text-xs text-white/20">{s.no}</span>
                </div>

                <div>
                  <h3 className="font-heading text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{s.desc}</p>
                  <p className="mt-3 text-xs text-white/30 leading-relaxed line-clamp-2">{s.detail}</p>
                </div>

                <div className="mt-auto flex items-center gap-1 text-xs text-jf-lime opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

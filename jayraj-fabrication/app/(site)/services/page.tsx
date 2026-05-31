import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Layers, Triangle, Layout, Store, Home, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Jayraj Fabrication",
  description: "Industrial PEB structures, roofing, tensile fabrication, ACP facades, commercial and residential projects across India.",
};

const SERVICES = [
  {
    slug: "industrial-peb", icon: Building2, no: "01",
    title: "Industrial & PEB Structures",
    short: "Prefabricated steel buildings & warehouses",
    desc: "We design and erect pre-engineered buildings for industrial, warehouse, and factory applications. From foundation design to the last bolt, our team handles the complete lifecycle of structural steel construction.",
    specs: ["Spans up to 90m", "Multi-bay structures", "Mezzanine floors", "Crane girder systems", "Fire-rated coatings"],
  },
  {
    slug: "roofing", icon: Layers, no: "02",
    title: "Roofing Solutions",
    short: "PPGI/PPGL, Galvalume, Polycarbonate sheets",
    desc: "Our roofing division supplies and installs the full range of roofing systems — from colour-coated PPGI sheets to Galvalume, polycarbonate skylights, and insulated sandwich panels.",
    specs: ["PPGI / PPGL sheets", "Galvalume roofing", "Polycarbonate daylighting", "Insulated panels", "Valley gutters & flashing"],
  },
  {
    slug: "tensile", icon: Triangle, no: "03",
    title: "Tensile Fabrication",
    short: "Tensile canopies & membrane structures",
    desc: "Our tensile structures team creates architecturally distinctive membrane canopies, ETFE structures, and cable net systems that define the character of commercial and public spaces.",
    specs: ["PVC & PTFE membranes", "Cable-supported canopies", "Shade sails", "Car parking canopies", "Stadium coverings"],
  },
  {
    slug: "elevation-facade", icon: Layout, no: "04",
    title: "Building Elevation & Façade",
    short: "ACP cladding & exterior systems",
    desc: "From ACP composite panels to glass curtain walls, we transform building exteriors into landmarks. Our façade team delivers precision installation with full waterproofing compliance.",
    specs: ["ACP cladding", "Glass curtain walls", "HPL panels", "Stone cladding", "Louver systems"],
  },
  {
    slug: "commercial", icon: Store, no: "05",
    title: "Commercial Buildings",
    short: "Malls, complexes & commercial shopfronts",
    desc: "We have delivered structural and façade packages for some of Gujarat and Maharashtra's most recognizable commercial developments — malls, multiplexes, business parks, and retail strips.",
    specs: ["Shopping malls", "Office complexes", "Multiplexes", "Showrooms", "Food courts"],
  },
  {
    slug: "residential", icon: Home, no: "06",
    title: "Residential Projects",
    short: "Custom residential roofing solutions",
    desc: "Our residential division provides roofing, pergola structures, and ACP elevation work for bungalows, villas, and residential societies — combining aesthetics with structural integrity.",
    specs: ["Bungalow roofing", "Pergolas & canopies", "ACP elevation", "Car porch structures", "Terrace waterproofing"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-jf-bg pt-24">
      <div className="bg-jf-bg-section border-b border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="section-label mb-3">What we do</p>
          <h1 className="section-heading text-white">OUR SERVICES</h1>
          <p className="section-subheading mt-4">
            End-to-end fabrication solutions — from structural steel to finished façades.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 space-y-8">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div id={s.slug} key={s.slug}
              className={`flex flex-col gap-8 rounded-2xl border border-white/10 bg-jf-bg-2 p-7 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-jf-lime/10 border border-jf-lime/20">
                    <Icon className="h-5 w-5 text-jf-lime" />
                  </div>
                  <span className="font-mono-jf text-xs text-white/30">{s.no}</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">{s.title}</h2>
                <p className="text-white/60 leading-relaxed">{s.desc}</p>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 text-sm text-jf-lime hover:underline">
                  Get a Quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex-shrink-0 lg:w-64">
                <div className="rounded-xl border border-white/10 bg-jf-bg-3 p-4">
                  <div className="mb-3 text-xs font-medium uppercase tracking-widest text-jf-lime">Applications</div>
                  <ul className="space-y-2">
                    {s.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="h-1 w-1 rounded-full bg-jf-lime shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

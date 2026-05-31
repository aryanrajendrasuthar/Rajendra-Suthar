import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aryan Suthar",
    role: "Business Consultant",
    rating: 5,
    text: "Jayraj Fabrication transformed what we envisioned into a stunning reality. Their team's precision and attention to detail on our PEB structure project was unmatched. Delivered on time, within budget, zero compromises on quality.",
  },
  {
    name: "Nevil Suthar",
    role: "Property Developer",
    rating: 5,
    text: "The tensile canopy they fabricated for our commercial complex became the landmark of the entire development. Professional team, premium material quality, and most importantly — they kept us informed at every step of the process.",
  },
  {
    name: "Jayesh Mistry",
    role: "Structural Consultant",
    rating: 5,
    text: "We've worked with several roofing contractors across Gujarat. Jayraj Fabrication stands apart. Their depth of understanding in structural requirements combined with aesthetic sensibility is truly rare in this industry.",
  },
  {
    name: "Yamik Mistry",
    role: "Project Manager",
    rating: 5,
    text: "From the first site visit to final handover, the experience was seamless. Their digital quotation system made the entire estimation process fully transparent. This is exactly how modern construction companies should operate.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-jf-bg-section py-24 overflow-hidden">
      <span className="pointer-events-none absolute -top-4 left-0 select-none font-display text-[200px] font-bold leading-none text-white/[0.02] opacity-60">
        04
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 text-center">
          <p className="section-label mb-3">Testimonials</p>
          <h2 className="section-heading text-white mx-auto">WHAT OUR CLIENTS SAY</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-jf-bg-2 p-6 pl-8"
            >
              {/* Lime left border */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-jf-lime" />

              {/* Large quote mark */}
              <div className="absolute top-4 right-5 font-display text-7xl font-bold leading-none text-jf-lime/10 select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-jf-lime text-jf-lime" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-white/70 italic">&ldquo;{t.text}&rdquo;</p>

              <div className="mt-auto pt-2 border-t border-white/10">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-xs text-white/40">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

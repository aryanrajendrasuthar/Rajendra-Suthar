const REASONS = [
  {
    title: "Design to Erection",
    body: "We manage the entire lifecycle from structural design to final erection. No handoffs, no blame-games. One team, full accountability.",
    img: "/images/placeholders/industrial-peb/1.jpg",
  },
  {
    title: "Pan-India Reach",
    body: "Operating from Vadodara and Surat, delivering across Gujarat, Maharashtra, Karnataka and beyond. 15+ cities served and counting.",
    img: "/images/placeholders/tensile/1.jpg",
  },
  {
    title: "Safety First",
    body: "Every project runs on documented safety protocols. Complex heights, heavy equipment, zero shortcuts. Our team goes home safe, every day.",
    img: "/images/placeholders/elevation-facade/1.jpg",
  },
  {
    title: "Competitive Edge",
    body: "Direct access to premium materials at source prices means your project costs less without compromise. Quality and value, together.",
    img: "/images/placeholders/commercial/1.jpg",
  },
];

export default function WhyJayraj() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Section watermark */}
      <span className="pointer-events-none absolute -top-4 right-0 select-none font-display text-[200px] font-bold leading-none text-jf-bg-3 opacity-60">
        03
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 text-center">
          <p className="section-label mb-3">Why us</p>
          <h2 className="section-heading text-white mx-auto">THE JAYRAJ DIFFERENCE</h2>
        </div>

        <div className="space-y-20">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={`flex flex-col items-center gap-10 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-jf-bg-3">
                  {/* Placeholder gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-jf-bg-3 via-jf-bg-2 to-jf-bg-section" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-8xl font-bold text-white/5">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  {/* Lime accent corner */}
                  <div className="absolute bottom-0 left-0 h-1 w-24 bg-jf-lime" />
                </div>
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <div className="font-mono-jf text-4xl font-bold text-white/5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-4xl font-bold uppercase text-white">
                  {r.title}
                </h3>
                <div className="mt-3 h-1 w-16 bg-jf-lime" />
                <p className="mt-5 text-lg leading-relaxed text-white/60">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

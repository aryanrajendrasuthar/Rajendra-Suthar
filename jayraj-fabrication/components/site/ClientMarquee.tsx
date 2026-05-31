const CLIENTS_ROW1 = [
  "Reliance Industries", "ABG Shipyard", "Welspun India", "Sumul Dairy", "Hindalco",
  "Polycab India", "Uka Tarsadia University", "City Mall", "Cairn Energy", "Topworth Pipes",
  "Alok Industries", "Bhilosa Industries", "Raghuvir Builders", "Square One Corporation",
  "Royal Arcade", "Tulsi Corporation", "Krishna Developers", "Auro University",
];

const CLIENTS_ROW2 = [
  "Sangini Developers", "Savlani Builders", "India Bulls", "Siddhi Vinayak Corporation",
  "Rahul Raj Mall", "Globale Infraspace", "Gokulam Buildcon", "L.D. Construction",
  "Karp Diamond", "Laxmi Diamond", "S.D. Jain College", "L.P. Savani School",
  "P.P. Savani School", "RMS Hospital", "Bharuch Mall", "Rajhans Builders",
  "GDC Hassan", "Bardoli Sugar Factory",
];

function MarqueeTrack({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-6 ${reverse ? "animate-marquee-r" : "animate-marquee"}`}
        aria-hidden="true"
      >
        {doubled.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium text-white/50">
            <span className="h-1 w-1 rounded-full bg-jf-lime" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ClientMarquee() {
  return (
    <section className="bg-jf-bg py-16 overflow-hidden border-y border-white/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 mb-10">
        <p className="section-label text-center mb-2">Trusted By</p>
        <h2 className="text-center font-heading text-2xl font-bold text-white">
          INDIA&apos;S BEST TRUST JAYRAJ
        </h2>
      </div>
      <div className="space-y-4">
        <MarqueeTrack items={CLIENTS_ROW1} />
        <MarqueeTrack items={CLIENTS_ROW2} reverse />
      </div>
    </section>
  );
}

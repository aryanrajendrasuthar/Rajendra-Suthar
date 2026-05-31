import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients — Jayraj Fabrication",
  description: "80+ trusted clients across industrial, commercial, education, healthcare, and gems sectors.",
};

const SECTORS = [
  {
    name: "Commercial / Real Estate",
    clients: [
      "Prime Shoppers", "Raghuvir Builders", "Square One Corporation", "Royal Arcade",
      "Tulsi Corporation", "Krishna Developers – Atlanta", "Krishna Creation",
      "Gorona Facade Solutions", "Saketh Enterprise", "Bhaktinandan Corporation",
      "Epoch Commercial Pvt Ltd", "Universal Enterprise (Green Paladia)", "Sangini Developers",
      "Jhokhi Builders – Vyara", "Savlani Builders", "Kuberji Developers", "Central Plaza",
      "City Mall – Baroda", "Bharuch Mall", "Rajhans Builders", "India Bulls – Baroda",
      "Siddhi Vinayak Corporation – Surat", "Surana Builders", "Gheelani Builders",
      "Western Construction (Kakadia Group)", "Western Construction – Adajan", "Hindva",
      "Angi Construction", "Rahul Raj Mall", "Anamika Developers", "White Wings",
      "Shah & Sanghvi Builders", "Globale Infraspace LLP", "Gokulam Buildcon",
      "Happy Home Corporation", "Monarch Corporation", "Vasudev Corporation",
      "Naik & Sheth Corporation", "Nimavi Corporation", "L.D. Construction",
    ],
  },
  {
    name: "Industrial / Manufacturing / Energy",
    clients: [
      "ABG Shipyard", "Reliance Industries – Hazira", "Cairn Energy – Hazira",
      "Kothari Beverages – Baroda/Kanpur", "GDC – Hassan (Karnataka)",
      "Topworth Pipes – Khopoli", "Alok Industries – Silvassa",
      "Bhilosa Industries – Silvassa", "Hindalco – Silvassa", "Welspun India Ltd",
      "Shekhavati Poly Yarn – Naroli", "Unify Poly Yarn – Khanvel", "Tuflex – Palej",
      "Aishwariya Dyeing Mill Pvt Ltd", "Smart Techno Space Pvt Ltd",
      "Bardoli Sugar Factory", "Sumul Dairy – Surat", "Hopes Hospitality Service Pvt Ltd",
      "Sprech Tenso Structure Pvt Ltd", "City Plus Fun World Pvt Ltd",
    ],
  },
  {
    name: "Education",
    clients: [
      "S.D. Jain College", "L.P. Savani School", "P.P. Savani School",
      "Aayurvedik College", "Uka Tarsadia University", "Auro University",
      "Bharuch Swaminarayan School", "Bhavnagar School", "Agarwal School",
    ],
  },
  {
    name: "Healthcare",
    clients: ["RMS Hospital – Bhavnagar", "Madhav Corporation – Bhavnagar"],
  },
  {
    name: "Gems & Diamond",
    clients: ["Karp Diamond", "Laxmi Diamond", "Ghodhani Gems", "Bhavani Gems", "K. Girdhar", "Shital Diamond"],
  },
];

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-jf-bg pt-24">
      {/* Hero */}
      <div className="bg-jf-bg-section border-b border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="section-label mb-3">Our Clients</p>
          <h1 className="section-heading text-white">TRUSTED BY INDIA&apos;S BEST</h1>
          <p className="section-subheading mt-4">
            80+ clients across industries — from Fortune 500 companies to landmark institutions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 space-y-14">
        {SECTORS.map((s) => (
          <div key={s.name}>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-jf-lime">
                {s.name}
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {s.clients.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-jf-bg-2 px-3 py-1.5 text-sm text-white/70 hover:border-jf-lime/30 hover:text-white transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

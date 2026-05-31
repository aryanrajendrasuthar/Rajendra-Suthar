/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jayraj Fabrication — Roofing Solutions Under One Roof",
  description:
    "Industrial PEB structures, tensile fabrication, roofing solutions across India since 2008. Based in Vadodara & Surat.",
  keywords: [
    "PEB structures Gujarat",
    "tensile fabrication Vadodara",
    "industrial roofing India",
    "steel fabrication Surat",
    "Jayraj Fabrication",
  ],
  openGraph: {
    title: "Jayraj Fabrication",
    description:
      "Industrial PEB structures, tensile fabrication, roofing solutions across India since 2008.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  icons: {
    icon: "/logo/jf-favicon.ico",
  },
};

const fonts = [
  barlowCondensed.variable,
  barlow.variable,
  inter.variable,
  spaceMono.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Local Business JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Jayraj Fabrication",
              address: {
                "@type": "PostalAddress",
                streetAddress: "513, Bakor Patel Chambers, Opp. Karelibaug Police Station, Bhutdizampa",
                addressLocality: "Vadodara",
                addressRegion: "Gujarat",
                postalCode: "390001",
                addressCountry: "IN",
              },
              telephone: "+919825098819",
              email: "jayrajfab09@gmail.com",
              foundingDate: "2008",
              areaServed: "India",
              url: "https://jayrajfabrication.com",
            }),
          }}
        />
      </head>
      <body className={`${fonts} antialiased`}>{children}</body>
    </html>
  );
}

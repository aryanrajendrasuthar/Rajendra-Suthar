/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import StatsBar from "@/components/site/StatsBar";
import ServicesGrid from "@/components/site/ServicesGrid";
import WhyJayraj from "@/components/site/WhyJayraj";
import Testimonials from "@/components/site/Testimonials";
import ClientMarquee from "@/components/site/ClientMarquee";
import InquiryCTA from "@/components/site/InquiryCTA";

export const metadata: Metadata = {
  title: "Jayraj Fabrication — Roofing Solutions Under One Roof",
  description:
    "Industrial PEB structures, tensile fabrication, roofing solutions across India since 2008. Based in Vadodara & Surat.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <WhyJayraj />
      <Testimonials />
      <ClientMarquee />
      <InquiryCTA />
    </>
  );
}

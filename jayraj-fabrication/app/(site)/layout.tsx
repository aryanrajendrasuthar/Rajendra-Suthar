/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

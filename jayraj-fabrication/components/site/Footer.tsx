import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const NAV = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/services", label: "Services" },
  { href: "/gallery",  label: "Gallery"  },
  { href: "/clients",  label: "Clients"  },
  { href: "/contact",  label: "Contact"  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-jf-bg">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo/jf-logo.jpeg"
                alt="Jayraj Fabrication"
                width={160}
                height={45}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Roofing Solutions Under One Roof. End-to-end fabrication since 2008.
            </p>
            <div className="mt-4 text-xs text-white/30 font-mono-jf">GST: 24ALNPS3233M1ZP</div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-white/50 hover:text-jf-lime transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vadodara */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Vadodara HQ</h4>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-jf-lime" />
                <span>513, Bakor Patel Chambers, Opp. Karelibaug Police Station, Bhutdizampa, Vadodara – 390001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-jf-lime" />
                <a href="tel:+919825098819" className="hover:text-white transition-colors">+91 9825098819</a>
              </div>
            </div>
          </div>

          {/* Surat */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Surat Office</h4>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-jf-lime" />
                <span>207, Richmond Plaza, Nr. Swastik Milestone, Above Dhiraj Sons, Vesu, Surat – 395007</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-jf-lime" />
                <a href="tel:+917069536308" className="hover:text-white transition-colors">+91 7069536308</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-jf-lime" />
                <a href="mailto:jayrajfab09@gmail.com" className="hover:text-white transition-colors">jayrajfab09@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/30">
            © 2025 Jayraj Fabrication. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with ♥ by{" "}
            <a
              href="mailto:aryanrajendrasuthar@gmail.com"
              className="text-jf-lime/60 hover:text-jf-lime transition-colors"
            >
              Aryan Suthar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

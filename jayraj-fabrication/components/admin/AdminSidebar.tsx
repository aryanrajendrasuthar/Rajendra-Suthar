"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  ImageIcon,
  Sparkles,
  FileText,
  Table2,
  Settings,
  X,
  Diamond,
} from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries",    label: "Inquiries",    icon: MessageSquare },
  { href: "/admin/gallery",      label: "Gallery",      icon: ImageIcon },
  { href: "/admin/holidays",     label: "Holiday Cards",icon: Sparkles },
  { href: "/admin/smartquote",   label: "SmartQuote ERP",icon: FileText },
  { href: "/admin/steel-table",  label: "Steel Table",  icon: Table2 },
  { href: "/admin/settings",     label: "Settings",     icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-jf-bg border-r border-white/10
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-jf-lime">
              <Diamond className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none text-white">JAYRAJ</div>
              <div className="text-[10px] tracking-widest text-jf-lime">FABRICATION</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden rounded p-1 text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                  ${
                    active
                      ? "border-l-2 border-jf-lime bg-jf-lime/10 pl-[10px] text-jf-lime font-medium"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-jf-lime" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-3">
          <div className="text-[10px] text-white/30">
            SmartQuote ERP v1.0
          </div>
          <div className="text-[10px] text-white/20">
            © 2025 Aryan Rajendra Suthar
          </div>
        </div>
      </aside>
    </>
  );
}

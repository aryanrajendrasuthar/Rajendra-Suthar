"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

const PAGE_TITLES: Record<string, string> = {
  "/admin":                    "Dashboard",
  "/admin/inquiries":          "Inquiries",
  "/admin/gallery":            "Gallery Manager",
  "/admin/holidays":           "Holiday Cards",
  "/admin/smartquote":         "SmartQuote ERP",
  "/admin/smartquote/new":     "New Quote",
  "/admin/smartquote/clients": "Clients",
  "/admin/smartquote/company": "Company Profile",
  "/admin/steel-table":        "ISS Steel Table",
  "/admin/settings":           "Settings",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/smartquote/") && pathname !== "/admin/smartquote/new")
    return "Quote Detail";
  if (pathname.startsWith("/admin/inquiries/")) return "Inquiry Detail";
  return "Admin";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-jf-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          title={getTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState<"checking" | "ok" | "error">("checking");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("settings").select("key").limit(1)
      .then(({ error }) => setDbStatus(error ? "error" : "ok"));
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="section-label">System</p>
        <h2 className="font-heading text-2xl font-bold text-white">Settings</h2>
      </div>

      {/* Company Info */}
      <div className="admin-card space-y-3">
        <h3 className="font-semibold text-white">Company Information</h3>
        <div className="text-sm text-white/60 space-y-1.5">
          <div className="flex justify-between"><span>Name</span><span className="text-white">Jayraj Fabrication</span></div>
          <div className="flex justify-between"><span>GST</span><span className="font-mono-jf text-white">24ALNPS3233M1ZP</span></div>
          <div className="flex justify-between"><span>Phone</span><span className="text-white">+91 9825098819</span></div>
          <div className="flex justify-between"><span>Email</span><span className="text-white">jayrajfab09@gmail.com</span></div>
        </div>
        <Link href="/admin/smartquote/company" className="btn-outline text-xs">
          Edit Company Profile (PDF) →
        </Link>
      </div>

      {/* Admin Users */}
      <div className="admin-card space-y-3">
        <h3 className="font-semibold text-white">Admin Users</h3>
        <p className="text-sm text-white/40">Users are managed via Supabase Authentication dashboard.</p>
        <div className="space-y-2 text-sm">
          {[
            { name: "Aryan Rajendra Suthar", email: "aryanrajendrasuthar@gmail.com", role: "super_admin" },
            { name: "Rajendra Suthar",       email: "jayrajfab09@gmail.com",          role: "owner"       },
            { name: "Manager",               email: "[to be configured]",             role: "manager"     },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5">
              <div>
                <div className="font-medium text-white">{u.name}</div>
                <div className="text-xs text-white/40">{u.email}</div>
              </div>
              <span className="text-xs font-mono-jf text-jf-lime">{u.role}</span>
            </div>
          ))}
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "https://supabase.com/dashboard/project/")}/auth/users`}
          target="_blank" rel="noopener noreferrer"
          className="btn-outline text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Manage in Supabase →
        </a>
      </div>

      {/* DB Status */}
      <div className="admin-card space-y-3">
        <h3 className="font-semibold text-white">Database Status</h3>
        <div className="flex items-center gap-2 text-sm">
          {dbStatus === "checking" && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
          )}
          {dbStatus === "ok" && <CheckCircle className="h-4 w-4 text-jf-lime" />}
          {dbStatus === "error" && <div className="h-4 w-4 rounded-full bg-red-400" />}
          <span className={dbStatus === "ok" ? "text-jf-lime" : dbStatus === "error" ? "text-red-400" : "text-white/50"}>
            Supabase — {dbStatus === "checking" ? "Checking…" : dbStatus === "ok" ? "Connected" : "Connection Failed"}
          </span>
        </div>
        {dbStatus === "error" && (
          <p className="text-xs text-red-400/70">Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local</p>
        )}
      </div>

      {/* Manual Setup Checklist */}
      <div className="admin-card space-y-3 border-jf-lime/20">
        <h3 className="font-semibold text-white">Manual Setup Checklist</h3>
        <div className="space-y-2 text-sm">
          {[
            "MANUAL-01: Run 001_initial.sql in Supabase SQL Editor",
            "MANUAL-02: Configure Resend API key in .env.local",
            "MANUAL-03: Deploy to Vercel with all env vars",
            "MANUAL-04: Create admin users in Supabase Auth dashboard",
            "MANUAL-05: Add hero-bg.mp4 to public/video/",
            "MANUAL-06: Add rajendra-suthar.jpg to public/images/team/",
            "MANUAL-07: Upload 7GB gallery via Cloudinary + Gallery Manager",
            "MANUAL-08: Set manager credentials in Supabase Auth",
            "MANUAL-09: Connect custom domain in Vercel",
            "MANUAL-10: Change default passwords (Admin@1100)",
            "MANUAL-SQ-01: Deploy pdf-export and email-quote edge functions",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-white/50">
              <div className="mt-1 h-3 w-3 shrink-0 rounded border border-white/20" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

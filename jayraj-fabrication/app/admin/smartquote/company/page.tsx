/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

type Company = {
  id: number; company_name: string; address_lines: string[];
  email: string | null; phone: string | null; signature_name: string | null;
  logo_path: string | null;
};

export default function CompanyPage() {
  const [row, setRow] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("company_profile").select("*").order("id").limit(1).maybeSingle()
      .then(({ data }) => { setRow(data as Company); setLoading(false); });
  }, []);

  async function save(patch: Partial<Company>) {
    if (!row) return;
    await supabase.from("company_profile").update(patch).eq("id", row.id);
    setRow({ ...row, ...patch });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
    </div>
  );

  if (!row) return (
    <div className="text-center py-16 text-white/40">
      No company profile found. Run the seed SQL in Supabase dashboard.
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/smartquote" className="btn-ghost p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Company Profile</h2>
            <p className="text-sm text-white/40">This information prints on the PDF quotation header and signature block.</p>
          </div>
          {saved && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-jf-lime">
              <CheckCircle className="h-4 w-4" /> Saved
            </div>
          )}
        </div>
      </div>

      <div className="admin-card space-y-5">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-jf-lime" />
          <h3 className="font-semibold text-white">Company Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="admin-label">Company Name</label>
            <input className="admin-input font-heading font-semibold" value={row.company_name}
              onChange={(e) => setRow({ ...row, company_name: e.target.value })}
              onBlur={() => save({ company_name: row.company_name })} />
          </div>

          <div>
            <label className="admin-label">Address (one line per row — prints on PDF)</label>
            <textarea className="admin-input min-h-[90px] resize-none"
              value={(row.address_lines ?? []).join("\n")}
              onChange={(e) => setRow({ ...row, address_lines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              onBlur={() => save({ address_lines: row.address_lines })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Email</label>
              <input type="email" className="admin-input" value={row.email ?? ""}
                onChange={(e) => setRow({ ...row, email: e.target.value })}
                onBlur={() => save({ email: row.email })} />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input className="admin-input" value={row.phone ?? ""}
                onChange={(e) => setRow({ ...row, phone: e.target.value })}
                onBlur={() => save({ phone: row.phone })} />
            </div>
          </div>

          <div>
            <label className="admin-label">Signature Name (prints at bottom of PDF)</label>
            <input className="admin-input" placeholder="Rajendra Suthar" value={row.signature_name ?? ""}
              onChange={(e) => setRow({ ...row, signature_name: e.target.value })}
              onBlur={() => save({ signature_name: row.signature_name })} />
          </div>

          <div>
            <label className="admin-label">Logo Storage Path</label>
            <input className="admin-input font-mono-jf text-sm" value={row.logo_path ?? ""}
              onChange={(e) => setRow({ ...row, logo_path: e.target.value })}
              onBlur={() => save({ logo_path: row.logo_path })} />
            <p className="mt-1.5 text-xs text-white/30">
              Upload your logo to Supabase Storage bucket <code className="text-jf-lime">assets</code> as <code className="text-jf-lime">logo.jpg</code>, then set path to <code className="text-jf-lime">assets/logo.jpg</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card border-jf-lime/20 bg-jf-lime/5 text-sm text-white/60">
        <p className="font-medium text-jf-lime mb-1">GST Number</p>
        <p className="font-mono-jf text-white">24ALNPS3233M1ZP</p>
        <p className="mt-1 text-xs text-white/30">This is hardcoded into the PDF template. Contact developer to change.</p>
      </div>
    </div>
  );
}

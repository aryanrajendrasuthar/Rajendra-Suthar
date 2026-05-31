import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Company = {
  id: number;
  company_name: string;
  address_lines: string[];
  email: string | null;
  phone: string | null;
  signature_name: string | null;
  logo_path: string | null;
};

export default function Company() {
  const [row, setRow] = useState<Company | null>(null);

  async function load() {
    const { data, error } = await supabase.from("company_profile").select("*").order("id", { ascending: true }).limit(1).maybeSingle();
    if (error) return alert(error.message);
    setRow(data as Company);
  }

  useEffect(() => { load(); }, []);

  if (!row) return <div className="p-6">Loading...</div>;

  async function save(patch: Partial<Company>) {
    const { error } = await supabase.from("company_profile").update(patch).eq("id", row.id);
    if (error) return alert(error.message);
    setRow({ ...row, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold">Company Profile</div>
        <div className="text-white/60 text-sm">This prints on the PDF signature block.</div>
      </div>

      <div className="card space-y-3">
        <label className="text-sm text-white/70">Company Name</label>
        <input className="input" value={row.company_name} onChange={e => save({ company_name: e.target.value })} />

        <label className="text-sm text-white/70">Address (one per line)</label>
        <textarea
          className="input min-h-[90px]"
          value={(row.address_lines || []).join("\n")}
          onChange={e => save({ address_lines: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
        />

        <label className="text-sm text-white/70">Email</label>
        <input className="input" value={row.email ?? ""} onChange={e => save({ email: e.target.value })} />

        <label className="text-sm text-white/70">Phone</label>
        <input className="input" value={row.phone ?? ""} onChange={e => save({ phone: e.target.value })} />

        <label className="text-sm text-white/70">Signature Name</label>
        <input className="input" value={row.signature_name ?? ""} onChange={e => save({ signature_name: e.target.value })} />

        <label className="text-sm text-white/70">Logo Storage Path</label>
        <input className="input" value={row.logo_path ?? ""} onChange={e => save({ logo_path: e.target.value })} />

        <div className="text-sm text-white/60">
          Upload your logo to Supabase Storage bucket <b>assets</b> as <b>logo.jpg</b>, and set Logo Storage Path to <code>assets/logo.jpg</code>.
        </div>
      </div>
    </div>
  );
}
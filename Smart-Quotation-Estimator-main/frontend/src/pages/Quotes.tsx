import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type QuoteRow = { id: number; quote_no: string; quote_date: string; subject: string; status: string };

export default function Quotes() {
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from("quotes")
      .select("id, quote_no, quote_date, subject, status")
      .order("id", { ascending: false });

    setLoading(false);
    if (error) return setErr(error.message);
    setRows((data || []) as QuoteRow[]);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Quotes</div>
          <div className="text-white/60 text-sm">Create and export quotations in Jayraj format.</div>
        </div>
        <button className="btn" onClick={async () => {
          const { data, error } = await supabase.from("quotes").insert({
            quote_no: "F-01",
            subject: "QUOTATIONFOR ...",
            status: "DRAFT",
            notes_lines: ["IF ANY CHANGE MADE IN MATERIAL THEN CHARGE EXTRA. (CLIENT MATERIAL)"],
            terms_lines: ["GST 18% EXTRA", "VALIDITY: 07 DAYS"]
          }).select("id").single();

          if (error) return alert(error.message);
          location.href = `/quotes/${data.id}`;
        }}>+ New Quote</button>
      </div>

      {err && <div className="text-red-300">{err}</div>}

      <div className="card">
        {loading ? <div>Loading...</div> : (
          <div className="divide-y divide-white/10">
            {rows.map(r => (
              <Link key={r.id} to={`/quotes/${r.id}`} className="flex items-center justify-between py-3 hover:bg-white/5 px-2 rounded-xl">
                <div>
                  <div className="font-semibold">{r.quote_no} <span className="text-white/50">•</span> {r.subject}</div>
                  <div className="text-sm text-white/60">{r.quote_date}</div>
                </div>
                <div className="text-sm rounded-full border border-white/10 px-3 py-1">{r.status}</div>
              </Link>
            ))}
            {rows.length === 0 && <div className="py-8 text-white/60">No quotes yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
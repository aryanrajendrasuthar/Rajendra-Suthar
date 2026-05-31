import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Quote = {
  id: number;
  quote_no: string;
  quote_date: string;
  subject: string;
  kind_attn: string | null;
  to_name: string | null;
  to_address_lines: string[];
  notes_lines: string[];
  terms_lines: string[];
};

type Item = {
  id: number;
  quote_id: number;
  line_no: number;
  title: string;
  include_lines: string[];
  qty: number;
  unit: string;
  rate: number;
  amount: number;
};

type Extra = {
  id: number;
  quote_id: number;
  line_no: number;
  label: string;
  extra_type: "EXTRA_TEXT" | "AMOUNT";
  amount: number | null;
};

export default function QuoteDetail() {
  const { id } = useParams();
  const quoteId = Number(id);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => items.reduce((s, i) => s + (Number(i.amount) || 0), 0), [items]);

  async function load() {
    const q = await supabase.from("quotes").select("*").eq("id", quoteId).single();
    if (q.error) return alert(q.error.message);
    setQuote(q.data as Quote);

    const it = await supabase.from("quote_items").select("*").eq("quote_id", quoteId).order("line_no", { ascending: true });
    if (it.error) return alert(it.error.message);
    setItems((it.data || []) as Item[]);

    const ex = await supabase.from("quote_extras").select("*").eq("quote_id", quoteId).order("line_no", { ascending: true });
    if (ex.error) return alert(ex.error.message);
    setExtras((ex.data || []) as Extra[]);
  }

  useEffect(() => { load(); }, [quoteId]);

  if (!quote) return <div className="p-6">Loading...</div>;

  async function saveQuote(patch: Partial<Quote>) {
    const { error } = await supabase.from("quotes").update(patch).eq("id", quoteId);
    if (error) return alert(error.message);
    setQuote({ ...quote, ...patch });
  }

  async function upsertItem(local: Partial<Item> & { id?: number }) {
    const payload = {
      quote_id: quoteId,
      line_no: local.line_no ?? 1,
      title: local.title ?? "",
      include_lines: local.include_lines ?? [],
      qty: Number(local.qty ?? 0),
      unit: local.unit ?? "SQFT",
      rate: Number(local.rate ?? 0),
      amount: Number(local.amount ?? (Number(local.qty ?? 0) * Number(local.rate ?? 0)))
    };
    if (local.id) {
      const { error } = await supabase.from("quote_items").update(payload).eq("id", local.id);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from("quote_items").insert(payload);
      if (error) return alert(error.message);
    }
    await load();
  }

  async function exportPdf() {
    setBusy(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in");

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-export`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ quoteId })
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Export failed");
      if (out.url) window.open(out.url, "_blank");
      else alert("Exported, but no URL returned.");
    } catch (e: any) {
      alert(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold">{quote.quote_no}</div>
          <div className="text-white/60 text-sm">Edit header, items, terms, then export PDF.</div>
        </div>
        <button className="btn" disabled={busy} onClick={exportPdf}>
          {busy ? "Exporting..." : "Export PDF"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <div className="text-lg font-semibold">Header</div>

          <label className="text-sm text-white/70">Quote No</label>
          <input className="input" value={quote.quote_no} onChange={e => saveQuote({ quote_no: e.target.value })} />

          <label className="text-sm text-white/70">Date</label>
          <input className="input" type="date" value={quote.quote_date} onChange={e => saveQuote({ quote_date: e.target.value })} />

          <label className="text-sm text-white/70">To (Name)</label>
          <input className="input" value={quote.to_name ?? ""} onChange={e => saveQuote({ to_name: e.target.value })} />

          <label className="text-sm text-white/70">To (Address lines, one per line)</label>
          <textarea
            className="input min-h-[90px]"
            value={(quote.to_address_lines || []).join("\n")}
            onChange={e => saveQuote({ to_address_lines: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
          />

          <label className="text-sm text-white/70">Kind Attn</label>
          <input className="input" value={quote.kind_attn ?? ""} onChange={e => saveQuote({ kind_attn: e.target.value })} />

          <label className="text-sm text-white/70">Subject</label>
          <input className="input" value={quote.subject} onChange={e => saveQuote({ subject: e.target.value })} />
        </div>

        <div className="card space-y-3">
          <div className="text-lg font-semibold">Notes & Terms</div>

          <label className="text-sm text-white/70">Notes (one per line)</label>
          <textarea
            className="input min-h-[110px]"
            value={(quote.notes_lines || []).join("\n")}
            onChange={e => saveQuote({ notes_lines: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
          />

          <label className="text-sm text-white/70">Terms & Conditions (one per line)</label>
          <textarea
            className="input min-h-[140px]"
            value={(quote.terms_lines || []).join("\n")}
            onChange={e => saveQuote({ terms_lines: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
          />
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Items</div>
          <button className="btn" onClick={() => upsertItem({
            line_no: (items[items.length - 1]?.line_no ?? 0) + 1,
            title: "FABRICATION WORK ...",
            include_lines: ["..."],
            qty: 0,
            unit: "SQFT",
            rate: 0
          })}>
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-white/70">
              <tr className="border-b border-white/10">
                <th className="py-2 text-left">No</th>
                <th className="py-2 text-left">Particulars</th>
                <th className="py-2 text-left">Qty</th>
                <th className="py-2 text-left">Unit</th>
                <th className="py-2 text-left">Rate</th>
                <th className="py-2 text-left">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map(it => (
                <tr key={it.id}>
                  <td className="py-2">{it.line_no}</td>
                  <td className="py-2">
                    <input
                      className="input"
                      value={it.title}
                      onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, title: e.target.value } : x))}
                      onBlur={() => upsertItem(items.find(x => x.id === it.id) || it)}
                    />
                    <textarea
                      className="input mt-2 min-h-[70px]"
                      value={(it.include_lines || []).join("\n")}
                      onChange={e => setItems(items.map(x => x.id === it.id
                        ? { ...x, include_lines: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) }
                        : x
                      ))}
                      onBlur={() => upsertItem(items.find(x => x.id === it.id) || it)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="input w-28"
                      value={it.qty}
                      onChange={e => {
                        const v = Number(e.target.value);
                        setItems(items.map(x => x.id === it.id ? { ...x, qty: v, amount: v * Number(x.rate) } : x));
                      }}
                      onBlur={() => upsertItem(items.find(x => x.id === it.id) || it)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="input w-24"
                      value={it.unit}
                      onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, unit: e.target.value } : x))}
                      onBlur={() => upsertItem(items.find(x => x.id === it.id) || it)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="input w-32"
                      value={it.rate}
                      onChange={e => {
                        const v = Number(e.target.value);
                        setItems(items.map(x => x.id === it.id ? { ...x, rate: v, amount: Number(x.qty) * v } : x));
                      }}
                      onBlur={() => upsertItem(items.find(x => x.id === it.id) || it)}
                    />
                  </td>
                  <td className="py-2">{it.amount.toFixed(2)}</td>
                  <td className="py-2">
                    <button className="text-red-300 hover:underline" onClick={async () => {
                      if (!confirm("Delete item?")) return;
                      const { error } = await supabase.from("quote_items").delete().eq("id", it.id);
                      if (error) return alert(error.message);
                      await load();
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="py-6 text-white/60" colSpan={7}>No items yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-lg font-bold">
          Total: Rs. {total.toFixed(2)}/-
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Extras</div>
          <button className="btn" onClick={async () => {
            const nextNo = (extras[extras.length - 1]?.line_no ?? 0) + 1;
            const { error } = await supabase.from("quote_extras").insert({
              quote_id: quoteId,
              line_no: nextNo,
              label: "GST 18%",
              extra_type: "EXTRA_TEXT",
              amount: null
            });
            if (error) return alert(error.message);
            await load();
          }}>+ Add Extra</button>
        </div>

        <div className="space-y-2">
          {extras.map(ex => (
            <div key={ex.id} className="flex flex-wrap items-center gap-2">
              <input className="input w-64" value={ex.label}
                onChange={e => setExtras(extras.map(x => x.id === ex.id ? { ...x, label: e.target.value } : x))}
                onBlur={async () => {
                  const cur = extras.find(x => x.id === ex.id)!;
                  const { error } = await supabase.from("quote_extras")
                    .update({ label: cur.label, extra_type: cur.extra_type, amount: cur.amount })
                    .eq("id", ex.id);
                  if (error) alert(error.message);
                }} />

              <select className="input w-40" value={ex.extra_type}
                onChange={e => {
                  const v = e.target.value as Extra["extra_type"];
                  setExtras(extras.map(x => x.id === ex.id ? { ...x, extra_type: v, amount: v === "AMOUNT" ? (x.amount ?? 0) : null } : x));
                }}
                onBlur={async () => {
                  const cur = extras.find(x => x.id === ex.id)!;
                  const { error } = await supabase.from("quote_extras")
                    .update({ label: cur.label, extra_type: cur.extra_type, amount: cur.amount })
                    .eq("id", ex.id);
                  if (error) alert(error.message);
                }}>
                <option value="EXTRA_TEXT">EXTRA</option>
                <option value="AMOUNT">AMOUNT</option>
              </select>

              {ex.extra_type === "AMOUNT" && (
                <input className="input w-40" value={ex.amount ?? 0}
                  onChange={e => setExtras(extras.map(x => x.id === ex.id ? { ...x, amount: Number(e.target.value) } : x))}
                  onBlur={async () => {
                    const cur = extras.find(x => x.id === ex.id)!;
                    const { error } = await supabase.from("quote_extras")
                      .update({ label: cur.label, extra_type: cur.extra_type, amount: cur.amount })
                      .eq("id", ex.id);
                    if (error) alert(error.message);
                  }} />
              )}

              <button className="text-red-300 hover:underline" onClick={async () => {
                if (!confirm("Delete extra?")) return;
                const { error } = await supabase.from("quote_extras").delete().eq("id", ex.id);
                if (error) return alert(error.message);
                await load();
              }}>Delete</button>
            </div>
          ))}
          {extras.length === 0 && <div className="text-white/60">No extras.</div>}
        </div>
      </div>
    </div>
  );
}
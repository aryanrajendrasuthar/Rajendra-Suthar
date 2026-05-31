/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Plus, Trash2, FileDown, Mail, ChevronDown, Copy, Check,
} from "lucide-react";

/* ─── Types ─── */
type Quote = {
  id: number; quote_no: string; quote_date: string; subject: string;
  kind_attn: string | null; to_name: string | null; to_address_lines: string[];
  notes_lines: string[]; terms_lines: string[]; status: string;
  validity_days: number;
};
type Item = {
  id: number; quote_id: number; line_no: number; title: string;
  include_lines: string[]; qty: number; unit: string; rate: number; amount: number;
};
type Extra = {
  id: number; quote_id: number; line_no: number; label: string;
  extra_type: "EXTRA_TEXT" | "AMOUNT"; amount: number | null;
};

/* ─── Status config ─── */
const STATUSES = ["DRAFT", "SENT", "APPROVED", "REJECTED", "ORDERED"] as const;
const STATUS_CLASS: Record<string, string> = {
  DRAFT: "status-draft", SENT: "status-sent", APPROVED: "status-approved",
  REJECTED: "status-rejected", ORDERED: "status-ordered",
};

/* ─── Helper ─── */
function rupees(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function QuoteDetailPage() {
  const { id } = useParams();
  const quoteId = Number(id);
  const router = useRouter();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [busy, setBusy] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendDone, setSendDone] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const supabase = createClient();

  const itemsTotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.amount ?? 0), 0),
    [items]
  );
  const extrasTotal = useMemo(
    () => extras.filter((e) => e.extra_type === "AMOUNT").reduce((s, e) => s + Number(e.amount ?? 0), 0),
    [extras]
  );
  const grandTotal = itemsTotal + extrasTotal;

  async function load() {
    const { data: q } = await supabase.from("quotes").select("*").eq("id", quoteId).single();
    if (q) setQuote(q as Quote);
    const { data: it } = await supabase.from("quote_items").select("*").eq("quote_id", quoteId).order("line_no");
    setItems((it ?? []) as Item[]);
    const { data: ex } = await supabase.from("quote_extras").select("*").eq("quote_id", quoteId).order("line_no");
    setExtras((ex ?? []) as Extra[]);
  }

  useEffect(() => { load(); }, [quoteId]);

  if (!quote) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
    </div>
  );

  async function saveQuote(patch: Partial<Quote>) {
    await supabase.from("quotes").update(patch).eq("id", quoteId);
    setQuote({ ...quote!, ...patch });
    // update total in DB
    if ("status" in patch) setShowStatusMenu(false);
  }

  async function updateTotal(newItemsTotal?: number) {
    const total = (newItemsTotal ?? itemsTotal) + extrasTotal;
    await supabase.from("quotes").update({ total }).eq("id", quoteId);
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
      amount: Number(local.amount ?? Number(local.qty ?? 0) * Number(local.rate ?? 0)),
    };
    if (local.id) {
      await supabase.from("quote_items").update(payload).eq("id", local.id);
    } else {
      await supabase.from("quote_items").insert(payload);
    }
    await load();
    await updateTotal();
  }

  async function deleteItem(itemId: number) {
    if (!confirm("Delete this line item?")) return;
    await supabase.from("quote_items").delete().eq("id", itemId);
    await load();
    await updateTotal();
  }

  async function addItem() {
    const nextNo = (items[items.length - 1]?.line_no ?? 0) + 1;
    await upsertItem({ line_no: nextNo, title: "FABRICATION WORK ...", include_lines: ["..."], qty: 0, unit: "SQFT", rate: 0 });
  }

  async function upsertExtra(ex: Extra) {
    await supabase.from("quote_extras").update({ label: ex.label, extra_type: ex.extra_type, amount: ex.amount }).eq("id", ex.id);
    await updateTotal();
  }

  async function addExtra() {
    const nextNo = (extras[extras.length - 1]?.line_no ?? 0) + 1;
    await supabase.from("quote_extras").insert({ quote_id: quoteId, line_no: nextNo, label: "GST 18%", extra_type: "EXTRA_TEXT", amount: null });
    await load();
  }

  async function deleteExtra(exId: number) {
    if (!confirm("Delete this extra?")) return;
    await supabase.from("quote_extras").delete().eq("id", exId);
    await load();
    await updateTotal();
  }

  async function handleExportPdf() {
    setBusy(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in");
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/pdf-export`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quoteId }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Export failed");
      setExportedUrl(out.url ?? null);
      if (out.url) window.open(out.url, "_blank");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleSendToClient() {
    if (!sendEmail || !quote) return;
    setSending(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/email-quote`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          to: sendEmail,
          subject: `Quotation ${quote.quote_no} — Jayraj Fabrication`,
          pdfUrl: exportedUrl,
          message: `Dear ${quote.to_name ?? "Sir/Madam"}, please find your quotation attached.`,
        }),
      });
      if (!res.ok) throw new Error("Email failed");
      setSendDone(true);
      await saveQuote({ status: "SENT" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    if (!quote || !confirm(`Delete quote ${quote.quote_no}? This cannot be undone.`)) return;
    await supabase.from("quotes").delete().eq("id", quoteId);
    router.push("/admin/smartquote");
  }

  async function handleCopyUrl() {
    if (!exportedUrl) return;
    await navigator.clipboard.writeText(exportedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/smartquote" className="btn-ghost p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-jf text-xl font-bold text-white">{quote.quote_no}</span>
              {/* Status badge + dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className={`${STATUS_CLASS[quote.status] ?? "status-draft"} flex items-center gap-1 cursor-pointer hover:opacity-80`}
                >
                  {quote.status}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showStatusMenu && (
                  <div className="absolute left-0 top-full z-20 mt-1 w-36 rounded-lg border border-white/10 bg-jf-bg-2 py-1 shadow-xl">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => saveQuote({ status: s })}
                        className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/5 ${quote.status === s ? "text-jf-lime" : "text-white/60"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-white/40">{quote.quote_date} · Edit header, items, terms, then export PDF.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportPdf} disabled={busy} className="btn-lime">
            <FileDown className="h-4 w-4" />
            {busy ? "Generating…" : "Export PDF"}
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* PDF URL + Send to Client */}
      {exportedUrl && (
        <div className="admin-card flex flex-wrap items-center gap-3 bg-jf-lime/5 border-jf-lime/30">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-jf-lime mb-1">PDF Generated ✓</p>
            <p className="text-xs text-white/50 truncate">{exportedUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopyUrl} className="btn-ghost text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-jf-lime" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <a href={exportedUrl} target="_blank" className="btn-outline text-xs">
              Open
            </a>
          </div>
          {/* Send to Client */}
          {!sendDone ? (
            <div className="flex w-full items-center gap-2 pt-2 border-t border-white/10">
              <Mail className="h-4 w-4 shrink-0 text-white/40" />
              <input
                type="email"
                placeholder="Client email…"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                className="admin-input flex-1 text-xs"
              />
              <button
                onClick={handleSendToClient}
                disabled={sending || !sendEmail}
                className="btn-lime text-xs"
              >
                {sending ? "Sending…" : "Send to Client"}
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center gap-2 pt-2 border-t border-white/10 text-xs text-jf-lime">
              <Check className="h-4 w-4" /> Email sent. Status updated to SENT.
            </div>
          )}
        </div>
      )}

      {/* Header fields */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Header</h3>
          <div>
            <label className="admin-label">Quote No</label>
            <input className="admin-input font-mono-jf" value={quote.quote_no}
              onChange={(e) => setQuote({ ...quote, quote_no: e.target.value })}
              onBlur={() => saveQuote({ quote_no: quote.quote_no })} />
          </div>
          <div>
            <label className="admin-label">Date</label>
            <input type="date" className="admin-input" value={quote.quote_date}
              onChange={(e) => saveQuote({ quote_date: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">To (Name)</label>
            <input className="admin-input" value={quote.to_name ?? ""}
              onChange={(e) => setQuote({ ...quote, to_name: e.target.value })}
              onBlur={() => saveQuote({ to_name: quote.to_name })} />
          </div>
          <div>
            <label className="admin-label">To (Address, one per line)</label>
            <textarea className="admin-input min-h-[80px] resize-none"
              value={(quote.to_address_lines ?? []).join("\n")}
              onChange={(e) => setQuote({ ...quote, to_address_lines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              onBlur={() => saveQuote({ to_address_lines: quote.to_address_lines })} />
          </div>
          <div>
            <label className="admin-label">Kind Attn</label>
            <input className="admin-input" value={quote.kind_attn ?? ""}
              onChange={(e) => setQuote({ ...quote, kind_attn: e.target.value })}
              onBlur={() => saveQuote({ kind_attn: quote.kind_attn })} />
          </div>
          <div>
            <label className="admin-label">Subject</label>
            <input className="admin-input" value={quote.subject}
              onChange={(e) => setQuote({ ...quote, subject: e.target.value })}
              onBlur={() => saveQuote({ subject: quote.subject })} />
          </div>
        </div>

        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Notes & Terms</h3>
          <div>
            <label className="admin-label">Notes (one per line)</label>
            <textarea className="admin-input min-h-[110px] resize-none"
              value={(quote.notes_lines ?? []).join("\n")}
              onChange={(e) => setQuote({ ...quote, notes_lines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              onBlur={() => saveQuote({ notes_lines: quote.notes_lines })} />
          </div>
          <div>
            <label className="admin-label">Terms & Conditions (one per line)</label>
            <textarea className="admin-input min-h-[140px] resize-none"
              value={(quote.terms_lines ?? []).join("\n")}
              onChange={(e) => setQuote({ ...quote, terms_lines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              onBlur={() => saveQuote({ terms_lines: quote.terms_lines })} />
          </div>
          <div>
            <label className="admin-label">Validity (days)</label>
            <input type="number" className="admin-input" value={quote.validity_days}
              onChange={(e) => saveQuote({ validity_days: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Line Items</h3>
          <button onClick={addItem} className="btn-lime text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/40">
                <th className="pb-2 text-left w-8">No</th>
                <th className="pb-2 text-left">Particulars</th>
                <th className="pb-2 text-left w-28">Qty</th>
                <th className="pb-2 text-left w-24">Unit</th>
                <th className="pb-2 text-left w-32">Rate (₹)</th>
                <th className="pb-2 text-right w-32">Amount</th>
                <th className="pb-2 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((it) => (
                <tr key={it.id} className="align-top">
                  <td className="py-3 pr-2 font-mono-jf text-white/40">{it.line_no}</td>
                  <td className="py-3 pr-3">
                    <input
                      className="admin-input text-xs"
                      value={it.title}
                      onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, title: e.target.value } : x))}
                      onBlur={() => upsertItem(items.find((x) => x.id === it.id) || it)}
                    />
                    <textarea
                      className="admin-input mt-1.5 min-h-[60px] resize-none text-xs text-white/50"
                      placeholder="Including: bullet points…"
                      value={(it.include_lines ?? []).join("\n")}
                      onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, include_lines: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) } : x))}
                      onBlur={() => upsertItem(items.find((x) => x.id === it.id) || it)}
                    />
                  </td>
                  <td className="py-3 pr-2">
                    <input className="admin-input font-mono-jf text-xs w-24" value={it.qty}
                      onChange={(e) => { const v = Number(e.target.value); setItems(items.map((x) => x.id === it.id ? { ...x, qty: v, amount: v * x.rate } : x)); }}
                      onBlur={() => upsertItem(items.find((x) => x.id === it.id) || it)} />
                  </td>
                  <td className="py-3 pr-2">
                    <input className="admin-input text-xs w-20" value={it.unit}
                      onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, unit: e.target.value } : x))}
                      onBlur={() => upsertItem(items.find((x) => x.id === it.id) || it)} />
                  </td>
                  <td className="py-3 pr-2">
                    <input className="admin-input font-mono-jf text-xs w-28" value={it.rate}
                      onChange={(e) => { const v = Number(e.target.value); setItems(items.map((x) => x.id === it.id ? { ...x, rate: v, amount: x.qty * v } : x)); }}
                      onBlur={() => upsertItem(items.find((x) => x.id === it.id) || it)} />
                  </td>
                  <td className="py-3 text-right font-mono-jf text-sm text-white">
                    {rupees(Number(it.amount))}
                  </td>
                  <td className="py-3 pl-2">
                    <button onClick={() => deleteItem(it.id)} className="btn-danger p-1.5">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-white/30">No items yet. Click + Add Item.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-3">
          <div className="text-right">
            <div className="text-xs text-white/40">Items Subtotal</div>
            <div className="font-mono-jf text-lg font-bold text-white">{rupees(itemsTotal)}</div>
          </div>
        </div>
      </div>

      {/* Extras */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Extras & Charges</h3>
          <button onClick={addExtra} className="btn-outline text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Extra
          </button>
        </div>

        <div className="space-y-2">
          {extras.map((ex) => (
            <div key={ex.id} className="flex flex-wrap items-center gap-2">
              <input className="admin-input w-56 text-sm"
                value={ex.label}
                onChange={(e) => setExtras(extras.map((x) => x.id === ex.id ? { ...x, label: e.target.value } : x))}
                onBlur={() => upsertExtra(extras.find((x) => x.id === ex.id)!)} />
              <select className="admin-input w-36 text-sm" value={ex.extra_type}
                onChange={(e) => {
                  const v = e.target.value as Extra["extra_type"];
                  setExtras(extras.map((x) => x.id === ex.id ? { ...x, extra_type: v, amount: v === "AMOUNT" ? (x.amount ?? 0) : null } : x));
                }}
                onBlur={() => upsertExtra(extras.find((x) => x.id === ex.id)!)} >
                <option value="EXTRA_TEXT">Text only</option>
                <option value="AMOUNT">Amount</option>
              </select>
              {ex.extra_type === "AMOUNT" && (
                <input className="admin-input w-36 font-mono-jf text-sm" value={ex.amount ?? 0}
                  onChange={(e) => setExtras(extras.map((x) => x.id === ex.id ? { ...x, amount: Number(e.target.value) } : x))}
                  onBlur={() => upsertExtra(extras.find((x) => x.id === ex.id)!)} />
              )}
              <button onClick={() => deleteExtra(ex.id)} className="btn-danger p-1.5">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {extras.length === 0 && <p className="text-sm text-white/30">No extras. Add GST, transportation, etc.</p>}
        </div>

        {/* Grand Total */}
        <div className="flex flex-col items-end gap-1 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between w-full sm:w-auto sm:gap-16">
            <span className="text-sm text-white/50">Items Subtotal</span>
            <span className="font-mono-jf text-sm text-white">{rupees(itemsTotal)}</span>
          </div>
          {extras.filter((e) => e.extra_type === "AMOUNT").map((e) => (
            <div key={e.id} className="flex items-center justify-between w-full sm:w-auto sm:gap-16">
              <span className="text-sm text-white/50">{e.label}</span>
              <span className="font-mono-jf text-sm text-white">{rupees(Number(e.amount ?? 0))}</span>
            </div>
          ))}
          <div className="flex items-center justify-between w-full sm:w-auto sm:gap-16 border-t border-white/20 pt-2 mt-1">
            <span className="font-semibold text-white">Grand Total</span>
            <span className="font-mono-jf text-xl font-bold text-jf-lime">{rupees(grandTotal)}</span>
          </div>
          <div className="text-xs text-white/30">Rs. {grandTotal.toFixed(2)}/-</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

type Client = { id: number; name: string; address_lines: string[]; contact_person: string | null; phone: string | null; email: string | null; city: string | null };

function generateNextQuoteNo(lastNo: string | null): string {
  if (!lastNo) return "F-001";
  // Extract trailing number, handle formats like F-08, F-030(A)
  const match = lastNo.match(/F-(\d+)/i);
  if (!match) return "F-001";
  const next = parseInt(match[1], 10) + 1;
  return `F-${String(next).padStart(3, "0")}`;
}

const DEFAULT_NOTES = [
  "IF ANY CHANGE MADE IN MATERIAL THEN CHARGE EXTRA. (CLIENT MATERIAL)",
];
const DEFAULT_TERMS = [
  "GST 18% EXTRA",
  "VALIDITY: 07 DAYS",
  "50% ADVANCE WITH ORDER",
  "BALANCE PAYMENT BEFORE DELIVERY / ERECTION",
];

export default function NewQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromInquiry = searchParams.get("from_inquiry");

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [quoteNo, setQuoteNo] = useState("");
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split("T")[0]);
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [kindAttn, setKindAttn] = useState("");
  const [subject, setSubject] = useState("QUOTATION FOR ");
  const [notes, setNotes] = useState(DEFAULT_NOTES.join("\n"));
  const [terms, setTerms] = useState(DEFAULT_TERMS.join("\n"));
  const [creating, setCreating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function init() {
      // Get next quote number
      const { data: last } = await supabase
        .from("quotes")
        .select("quote_no")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      setQuoteNo(generateNextQuoteNo(last?.quote_no ?? null));

      // Load clients
      const { data: clientData } = await supabase
        .from("clients")
        .select("id, name, address_lines, contact_person, phone, email, city")
        .order("name", { ascending: true });
      setClients((clientData ?? []) as Client[]);

      // Pre-fill from inquiry if param exists
      if (fromInquiry) {
        const { data: inq } = await supabase
          .from("inquiries")
          .select("name, phone, email, city, service, company")
          .eq("id", fromInquiry)
          .maybeSingle();
        if (inq) {
          setToName(inq.name ?? "");
          setKindAttn(inq.name ?? "");
          setSubject(`QUOTATION FOR ${(inq.service ?? "").toUpperCase().replace(/_/g, " ")}`);
        }
      }
    }
    init();
  }, [fromInquiry]);

  function applyClient(clientId: number) {
    const c = clients.find((x) => x.id === clientId);
    if (!c) return;
    setSelectedClientId(clientId);
    setToName(c.name);
    setToAddress((c.address_lines ?? []).join("\n"));
    if (c.contact_person) setKindAttn(c.contact_person);
  }

  async function handleCreate() {
    setCreating(true);
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        quote_no: quoteNo,
        quote_date: quoteDate,
        client_id: selectedClientId,
        to_name: toName || null,
        to_address_lines: toAddress.split("\n").map((s) => s.trim()).filter(Boolean),
        kind_attn: kindAttn || null,
        subject,
        status: "DRAFT",
        notes_lines: notes.split("\n").map((s) => s.trim()).filter(Boolean),
        terms_lines: terms.split("\n").map((s) => s.trim()).filter(Boolean),
      })
      .select("id")
      .single();

    if (error) {
      alert(error.message);
      setCreating(false);
      return;
    }

    router.push(`/admin/smartquote/${data.id}`);
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/smartquote" className="btn-ghost p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">New Quote</h2>
          <p className="text-sm text-white/40">Quote number will be <span className="font-mono-jf text-jf-lime">{quoteNo}</span></p>
        </div>
      </div>

      {fromInquiry && (
        <div className="rounded-lg border border-jf-lime/30 bg-jf-lime/10 px-4 py-2.5 text-sm text-jf-lime">
          Pre-filling from Inquiry #{fromInquiry}. Review and adjust as needed.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Quote Header */}
        <div className="admin-card space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-jf-lime" />
            <h3 className="font-semibold text-white">Quote Header</h3>
          </div>

          <div>
            <label className="admin-label">Quote No</label>
            <input
              className="admin-input font-mono-jf"
              value={quoteNo}
              onChange={(e) => setQuoteNo(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Date</label>
            <input
              type="date"
              className="admin-input"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Subject</label>
            <input
              className="admin-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        {/* Client Info */}
        <div className="admin-card space-y-4">
          <h3 className="font-semibold text-white">Client Details</h3>

          {clients.length > 0 && (
            <div>
              <label className="admin-label">Saved Client (optional)</label>
              <select
                className="admin-input"
                value={selectedClientId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id) applyClient(id);
                  else setSelectedClientId(null);
                }}
              >
                <option value="">— Select to auto-fill —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.city ? `(${c.city})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="admin-label">To (Name / Company)</label>
            <input
              className="admin-input"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Address (one per line)</label>
            <textarea
              className="admin-input min-h-[80px] resize-none"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Kind Attn</label>
            <input
              className="admin-input"
              value={kindAttn}
              onChange={(e) => setKindAttn(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Notes</h3>
          <label className="admin-label">One per line</label>
          <textarea
            className="admin-input min-h-[100px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Terms & Conditions</h3>
          <label className="admin-label">One per line</label>
          <textarea
            className="admin-input min-h-[100px] resize-none"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleCreate} disabled={creating} className="btn-lime">
          {creating ? "Creating…" : "Create Quote & Add Items →"}
        </button>
        <Link href="/admin/smartquote" className="btn-outline">
          Cancel
        </Link>
      </div>
    </div>
  );
}

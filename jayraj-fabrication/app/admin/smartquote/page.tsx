/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, FileText, ChevronRight, Search, Filter } from "lucide-react";

type QuoteRow = {
  id: number;
  quote_no: string;
  quote_date: string;
  subject: string;
  status: string;
  total: number | null;
  client_id: number | null;
};

const STATUS_FILTER = ["ALL", "DRAFT", "SENT", "APPROVED", "REJECTED", "ORDERED"] as const;

function StatusPill({ status }: { status: string }) {
  const cls: Record<string, string> = {
    DRAFT:    "status-draft",
    SENT:     "status-sent",
    APPROVED: "status-approved",
    REJECTED: "status-rejected",
    ORDERED:  "status-ordered",
  };
  return <span className={cls[status] ?? "status-draft"}>{status}</span>;
}

export default function SmartQuotePage() {
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("quotes")
      .select("id, quote_no, quote_date, subject, status, total, client_id")
      .order("id", { ascending: false });
    setRows((data ?? []) as QuoteRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchSearch =
      search === "" ||
      r.quote_no.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    DRAFT:    rows.filter((r) => r.status === "DRAFT").length,
    SENT:     rows.filter((r) => r.status === "SENT").length,
    APPROVED: rows.filter((r) => r.status === "APPROVED").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">ERP</p>
          <h2 className="font-heading text-2xl font-bold text-white">SmartQuote</h2>
          <p className="text-sm text-white/50">
            {rows.length} total quotes
          </p>
        </div>
        <Link href="/admin/smartquote/new" className="btn-lime">
          <Plus className="h-4 w-4" />
          New Quote
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Draft", count: counts.DRAFT, cls: "text-gray-400" },
          { label: "Sent", count: counts.SENT, cls: "text-blue-400" },
          { label: "Approved", count: counts.APPROVED, cls: "text-jf-lime" },
        ].map((s) => (
          <div key={s.label} className="admin-card text-center py-3">
            <div className={`font-mono-jf text-2xl font-bold ${s.cls}`}>{s.count}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search quote no. or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 shrink-0 text-white/40" />
          {STATUS_FILTER.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-jf-lime text-black"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quote list */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/40">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/30">
            <FileText className="h-10 w-10" />
            <p className="text-sm">
              {search || statusFilter !== "ALL" ? "No quotes match your filters." : "No quotes yet. Create your first one."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((q) => (
              <Link
                key={q.id}
                href={`/admin/smartquote/${q.id}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jf-bg-3">
                    <FileText className="h-4 w-4 text-jf-lime" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-jf text-sm font-bold text-white">
                        {q.quote_no}
                      </span>
                      <StatusPill status={q.status} />
                    </div>
                    <div className="mt-0.5 text-sm text-white/50 line-clamp-1">
                      {q.subject}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    {q.total != null && (
                      <div className="font-mono-jf text-sm text-white">
                        ₹{q.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    )}
                    <div className="text-xs text-white/30">{q.quote_date}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Link href="/admin/smartquote/clients" className="btn-ghost text-xs">
          Manage Clients
        </Link>
        <Link href="/admin/smartquote/company" className="btn-ghost text-xs">
          Company Profile
        </Link>
      </div>
    </div>
  );
}

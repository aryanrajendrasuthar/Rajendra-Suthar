/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, MessageSquare, ChevronRight } from "lucide-react";

type Inquiry = {
  id: number; name: string; company: string | null; phone: string;
  service: string | null; city: string | null; status: string;
  created_at: string; is_read: boolean;
};

const STATUSES = ["all", "new", "in_progress", "converted", "closed"] as const;
const STATUS_CLASS: Record<string, string> = {
  new: "status-new", in_progress: "status-in_progress",
  converted: "status-converted", closed: "status-closed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function InquiriesPage() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      let q = supabase.from("inquiries")
        .select("id, name, company, phone, service, city, status, created_at, is_read")
        .order("created_at", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data } = await q;
      setRows((data ?? []) as Inquiry[]);
      setLoading(false);
    }
    load();
  }, [statusFilter]);

  const filtered = rows.filter((r) =>
    search === "" ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search) ||
    (r.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">CRM</p>
          <h2 className="font-heading text-2xl font-bold text-white">Inquiries</h2>
          <p className="text-sm text-white/40">{rows.length} total · {rows.filter((r) => !r.is_read).length} unread</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text" placeholder="Search name, company, phone, city…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 shrink-0 text-white/40" />
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-jf-lime text-black"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-white/30">
            <MessageSquare className="h-10 w-10" />
            <p className="text-sm">No inquiries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((inq) => (
              <Link key={inq.id} href={`/admin/inquiries/${inq.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {!inq.is_read && <div className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />}
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">
                      {inq.name}
                      {inq.company && <span className="ml-2 text-white/40 text-sm">· {inq.company}</span>}
                    </div>
                    <div className="text-xs text-white/40">
                      {inq.phone} {inq.city && `· ${inq.city}`} {inq.service && `· ${inq.service.replace(/_/g, " ")}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={STATUS_CLASS[inq.status] ?? "status-new"}>
                    {inq.status.replace("_", " ")}
                  </span>
                  <span className="hidden text-xs text-white/30 sm:block">{formatDate(inq.created_at)}</span>
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare, ImageIcon, FileText, CalendarDays,
  Plus, ChevronRight, TrendingUp,
} from "lucide-react";

type InquiryRow = { id: number; name: string; company: string | null; service: string | null; city: string | null; status: string; created_at: string; is_read: boolean };
type Stats = { inquiries: number; unread: number; gallery: number; quotes: number };

const STATUS_CLASS: Record<string, string> = {
  new: "status-new", in_progress: "status-in_progress",
  converted: "status-converted", closed: "status-closed",
};

const UPCOMING_FESTIVALS = [
  { name: "Independence Day",       date: "2025-08-15" },
  { name: "Raksha Bandhan",         date: "2025-08-09" },
  { name: "Janmashtami",            date: "2025-08-16" },
  { name: "Ganesh Chaturthi",       date: "2025-08-27" },
  { name: "Navratri",               date: "2025-09-22" },
  { name: "Dussehra",               date: "2025-10-02" },
  { name: "Diwali",                 date: "2025-10-20" },
  { name: "Gujarati New Year",      date: "2025-10-22" },
  { name: "Labh Pancham",           date: "2025-10-25" },
  { name: "Christmas",              date: "2025-12-25" },
  { name: "New Year 2026",          date: "2026-01-01" },
  { name: "Uttarayan",              date: "2026-01-14" },
];

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ inquiries: 0, unread: 0, gallery: 0, quotes: 0 });
  const [recent, setRecent] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [inqAll, inqUnread, gallery, quotes, recentInq] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("quotes").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id,name,company,service,city,status,created_at,is_read").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({
        inquiries: inqAll.count ?? 0,
        unread:    inqUnread.count ?? 0,
        gallery:   gallery.count ?? 0,
        quotes:    quotes.count ?? 0,
      });
      setRecent((recentInq.data ?? []) as InquiryRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const upcomingFestivals = UPCOMING_FESTIVALS
    .map((f) => ({ ...f, days: daysUntil(f.date) }))
    .filter((f) => f.days >= 0 && f.days <= 60)
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const STAT_CARDS = [
    { label: "Total Inquiries", value: stats.inquiries, icon: MessageSquare, href: "/admin/inquiries", color: "text-blue-400" },
    { label: "Unread Inquiries", value: stats.unread, icon: TrendingUp, href: "/admin/inquiries?status=new", color: "text-amber-400", badge: stats.unread > 0 },
    { label: "Gallery Images",  value: stats.gallery,   icon: ImageIcon,     href: "/admin/gallery",    color: "text-purple-400" },
    { label: "Quotes Created",  value: stats.quotes,    icon: FileText,      href: "/admin/smartquote", color: "text-jf-lime" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Overview</p>
        <h2 className="font-heading text-2xl font-bold text-white">Dashboard</h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="admin-card group relative flex flex-col gap-3 transition-all hover:border-white/20">
              {s.badge && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
                  {stats.unread > 9 ? "9+" : stats.unread}
                </span>
              )}
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
              </div>
              <div>
                <div className={`font-mono-jf text-2xl font-bold ${s.color}`}>
                  {loading ? "–" : s.value}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Inquiries */}
        <div className="admin-card lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-xs text-jf-lime hover:underline">View all →</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
            </div>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/30">No inquiries yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((inq) => (
                <Link key={inq.id} href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center justify-between py-2.5 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    {!inq.is_read && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />}
                    <div>
                      <div className="text-sm font-medium text-white">
                        {inq.name} {inq.company && <span className="text-white/40">· {inq.company}</span>}
                      </div>
                      <div className="text-xs text-white/40">
                        {inq.service?.replace(/_/g, " ") ?? "—"} {inq.city && `· ${inq.city}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={STATUS_CLASS[inq.status] ?? "status-new"}>{inq.status.replace(/_/g, " ")}</span>
                    <span className="text-xs text-white/30">{formatDate(inq.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Festivals + Quick Actions */}
        <div className="space-y-4">
          <div className="admin-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-jf-lime" /> Upcoming Festivals
              </h3>
              <Link href="/admin/holidays" className="text-xs text-jf-lime hover:underline">Generate →</Link>
            </div>
            <div className="space-y-2">
              {upcomingFestivals.map((f) => (
                <div key={f.name} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{f.name}</span>
                  <span className={`text-xs font-mono-jf ${f.days <= 7 ? "text-amber-400" : "text-white/30"}`}>
                    {f.days === 0 ? "Today" : `${f.days}d`}
                  </span>
                </div>
              ))}
              {upcomingFestivals.length === 0 && (
                <p className="text-xs text-white/30">No festivals in the next 60 days.</p>
              )}
            </div>
          </div>

          <div className="admin-card space-y-2">
            <h3 className="font-semibold text-white text-sm">Quick Actions</h3>
            <Link href="/admin/smartquote/new" className="btn-lime w-full justify-center text-sm">
              <Plus className="h-4 w-4" /> New Quote
            </Link>
            <Link href="/admin/inquiries" className="btn-outline w-full justify-center text-sm">
              <MessageSquare className="h-4 w-4" /> View Inquiries
            </Link>
            <Link href="/admin/holidays" className="btn-ghost w-full justify-center text-sm">
              <CalendarDays className="h-4 w-4" /> Generate Festival Card
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

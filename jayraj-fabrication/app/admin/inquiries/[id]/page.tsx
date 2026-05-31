/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Phone, Mail, MapPin, FileText, ChevronDown } from "lucide-react";

type Inquiry = {
  id: number; name: string; company: string | null; phone: string; email: string | null;
  city: string | null; service: string | null; description: string | null;
  contact_pref: string | null; source: string | null; status: string;
  notes: string | null; is_read: boolean; created_at: string;
};

const STATUSES = ["new", "in_progress", "converted", "closed"] as const;
const STATUS_CLASS: Record<string, string> = {
  new: "status-new", in_progress: "status-in_progress",
  converted: "status-converted", closed: "status-closed",
};

export default function InquiryDetailPage() {
  const { id } = useParams();
  const [inq, setInq] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("inquiries").select("*").eq("id", id).single();
      if (data) {
        setInq(data as Inquiry);
        setNotes(data.notes ?? "");
        // Mark as read
        if (!data.is_read) {
          await supabase.from("inquiries").update({ is_read: true }).eq("id", id);
        }
      }
    }
    load();
  }, [id]);

  async function updateStatus(status: string) {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    setInq((i) => i ? { ...i, status } : i);
    setShowStatusMenu(false);
  }

  async function saveNotes() {
    await supabase.from("inquiries").update({ notes }).eq("id", id);
  }

  if (!inq) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/inquiries" className="btn-ghost p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">{inq.name}</h2>
            <p className="text-sm text-white/40">
              Inquiry #{inq.id} · {new Date(inq.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>
          {/* Status */}
          <div className="ml-auto relative">
            <button onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`${STATUS_CLASS[inq.status]} flex items-center gap-1 cursor-pointer hover:opacity-80`}>
              {inq.status.replace("_", " ")}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-white/10 bg-jf-bg-2 py-1 shadow-xl">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => updateStatus(s)}
                    className={`w-full px-3 py-1.5 text-left text-xs capitalize hover:bg-white/5 transition-colors ${inq.status === s ? "text-jf-lime" : "text-white/60"}`}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Contact Info */}
        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Contact Details</h3>
          <div className="space-y-2.5 text-sm">
            {inq.company && <div className="text-white/60">{inq.company}</div>}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-jf-lime shrink-0" />
              <a href={`tel:${inq.phone}`} className="text-white hover:text-jf-lime">{inq.phone}</a>
            </div>
            {inq.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-jf-lime shrink-0" />
                <a href={`mailto:${inq.email}`} className="text-white hover:text-jf-lime">{inq.email}</a>
              </div>
            )}
            {inq.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-jf-lime shrink-0" />
                <span className="text-white/60">{inq.city}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div><span className="text-white/40">Service:</span> <span className="text-white">{inq.service?.replace(/_/g, " ") ?? "—"}</span></div>
            <div><span className="text-white/40">Contact via:</span> <span className="text-white capitalize">{inq.contact_pref ?? "—"}</span></div>
            <div><span className="text-white/40">Source:</span> <span className="text-white">{inq.source ?? "—"}</span></div>
          </div>
        </div>

        {/* Project Brief */}
        <div className="admin-card space-y-3">
          <h3 className="font-semibold text-white">Project Brief</h3>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
            {inq.description ?? "No description provided."}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="admin-card space-y-3">
        <h3 className="font-semibold text-white">Internal Notes</h3>
        <textarea
          className="admin-input min-h-[100px] resize-none"
          placeholder="Add notes, follow-up reminders, internal comments…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
        />
        <p className="text-xs text-white/30">Notes are saved automatically on blur.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a href={`https://wa.me/${inq.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
          className="btn-lime">
          WhatsApp {inq.name.split(" ")[0]}
        </a>
        <Link href={`/admin/smartquote/new?from_inquiry=${inq.id}`} className="btn-outline">
          <FileText className="h-4 w-4" />
          Convert to Quote
        </Link>
      </div>
    </div>
  );
}

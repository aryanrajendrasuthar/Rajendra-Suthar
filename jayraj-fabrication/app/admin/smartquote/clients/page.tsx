/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, User, Phone, Mail, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Client = {
  id: number; name: string; address_lines: string[]; city: string | null;
  contact_person: string | null; phone: string | null; email: string | null;
  created_at: string;
};

const EMPTY = { name: "", address: "", city: "", contact_person: "", phone: "", email: "" };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("id, name, address_lines, city, contact_person, phone, email, created_at")
      .order("name", { ascending: true });
    setClients((data ?? []) as Client[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("clients").insert({
      name: form.name.trim(),
      address_lines: form.address.split("\n").map((s) => s.trim()).filter(Boolean),
      city: form.city.trim() || null,
      contact_person: form.contact_person.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
    });
    setSaving(false);
    if (error) { alert(error.message); return; }
    setForm(EMPTY);
    await load();
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete client "${name}"?`)) return;
    await supabase.from("clients").delete().eq("id", id);
    await load();
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/smartquote" className="btn-ghost p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Clients</h2>
          <p className="text-sm text-white/40">Save client details for quick quoting. {clients.length} saved.</p>
        </div>
      </div>

      {/* Add Client Form */}
      <div className="admin-card space-y-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-jf-lime" /> Add Client
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="admin-label">Name / Company *</label>
              <input required className="admin-input" placeholder="Raghuvir Builders"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">City</label>
              <input className="admin-input" placeholder="Vadodara"
                value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Contact Person</label>
              <input className="admin-input" placeholder="Mr. Ravi Shah"
                value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input className="admin-input" placeholder="+91 98250 00000"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Email</label>
              <input type="email" className="admin-input" placeholder="client@company.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Address (one line per row)</label>
              <textarea className="admin-input min-h-[70px] resize-none" placeholder="207, Richmond Plaza..."
                value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-lime">
            {saving ? "Saving…" : "Save Client"}
          </button>
        </form>
      </div>

      {/* Client List */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/30">No clients saved yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {clients.map((c) => (
              <div key={c.id}>
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-jf-bg-3">
                      <User className="h-4 w-4 text-jf-lime" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        {c.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</span>}
                        {c.contact_person && <span>{c.contact_person}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expanded === c.id ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                  </div>
                </button>

                {expanded === c.id && (
                  <div className="border-t border-white/5 bg-jf-bg-3/50 px-5 py-4">
                    <div className="grid gap-2 sm:grid-cols-2 text-sm">
                      {c.phone && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Phone className="h-3.5 w-3.5 text-jf-lime" />
                          <a href={`tel:${c.phone}`} className="hover:text-white">{c.phone}</a>
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="h-3.5 w-3.5 text-jf-lime" />
                          <a href={`mailto:${c.email}`} className="hover:text-white">{c.email}</a>
                        </div>
                      )}
                      {(c.address_lines ?? []).length > 0 && (
                        <div className="sm:col-span-2 text-white/50 text-xs">
                          {c.address_lines.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/admin/smartquote/new?client_id=${c.id}`}
                        className="btn-lime text-xs"
                      >
                        New Quote for {c.name.split(" ")[0]}
                      </Link>
                      <button onClick={() => handleDelete(c.id, c.name)} className="btn-danger text-xs">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

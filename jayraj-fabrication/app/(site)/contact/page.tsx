/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, AlertCircle, Send } from "lucide-react";

const SERVICES = [
  "Industrial & PEB Structures",
  "Roofing Solutions",
  "Tensile Fabrication",
  "Building Elevation & Façade",
  "Commercial Buildings",
  "Residential Projects",
  "Other",
];

const SOURCES = [
  "Google Search",
  "Word of mouth / Referral",
  "Social Media",
  "Past Client",
  "Other",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "", city: "",
    service: "", description: "", contact_pref: "whatsapp", source: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.description.length < 20) {
      setErrorMsg("Please describe your project briefly (min 20 characters).");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setState("success");
      setForm({ name: "", company: "", phone: "", email: "", city: "", service: "", description: "", contact_pref: "whatsapp", source: "" });
    } catch {
      setErrorMsg("Something went wrong. Please try WhatsApp or call us directly.");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen bg-jf-bg pt-24">
      {/* Hero */}
      <div className="relative bg-jf-bg-section py-16 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="section-label mb-3">Contact</p>
          <h1 className="section-heading text-white">GET IN TOUCH</h1>
          <p className="section-subheading mt-4">
            Tell us about your project. We respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form — 60% */}
          <div className="lg:col-span-3">
            {state === "success" ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-jf-lime/30 bg-jf-lime/10 py-16 text-center">
                <CheckCircle className="h-12 w-12 text-jf-lime" />
                <h2 className="font-heading text-2xl font-bold text-white">Inquiry Received!</h2>
                <p className="text-white/60">We&apos;ll be in touch within 24 hours.</p>
                <button onClick={() => setState("idle")} className="btn-lime mt-2">
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-heading text-xl font-bold text-white">Inquire Now</h2>

                {state === "error" && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {errorMsg}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Full Name *</label>
                    <input required className="admin-input" placeholder="Rajesh Shah"
                      value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Company / Organization</label>
                    <input className="admin-input" placeholder="Shah Builders Pvt Ltd"
                      value={form.company} onChange={(e) => set("company", e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Phone * (+91)</label>
                    <input required type="tel" className="admin-input" placeholder="+91 98250 00000"
                      value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input type="email" className="admin-input" placeholder="you@company.com"
                      value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">City / Location</label>
                    <input className="admin-input" placeholder="Vadodara"
                      value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Service Required</label>
                    <select className="admin-input" value={form.service} onChange={(e) => set("service", e.target.value)}>
                      <option value="">— Select service —</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="admin-label">Project Brief * (min 20 chars)</label>
                  <textarea required className="admin-input min-h-[120px] resize-none"
                    placeholder="Describe your project — size, location, timeline, any special requirements…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)} />
                  <div className="mt-1 text-right text-xs text-white/30">{form.description.length} chars</div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Preferred Contact</label>
                    <div className="flex gap-2">
                      {["whatsapp", "email", "call"].map((p) => (
                        <button type="button" key={p} onClick={() => set("contact_pref", p)}
                          className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors capitalize ${
                            form.contact_pref === p
                              ? "border-jf-lime bg-jf-lime/10 text-jf-lime"
                              : "border-white/10 text-white/50 hover:border-white/30"
                          }`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">How did you hear?</label>
                    <select className="admin-input" value={form.source} onChange={(e) => set("source", e.target.value)}>
                      <option value="">— Select —</option>
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={state === "loading"} className="btn-lime px-6 py-3">
                    <Send className="h-4 w-4" />
                    {state === "loading" ? "Sending…" : "Send Inquiry →"}
                  </button>
                  <a
                    href="https://wa.me/919825098819"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-6 py-3"
                  >
                    Schedule via WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Info — 40% */}
          <div className="space-y-6 lg:col-span-2">
            <div className="admin-card space-y-4">
              <h3 className="font-heading font-semibold text-white">Head Office — Vadodara</h3>
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-jf-lime" />
                  <span>513, Bakor Patel Chambers, Opp. Karelibaug Police Station, Bhutdizampa, Vadodara – 390001</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-jf-lime" />
                  <a href="tel:+919825098819" className="hover:text-white">+91 9825098819</a>
                </div>
              </div>
            </div>

            <div className="admin-card space-y-4">
              <h3 className="font-heading font-semibold text-white">Surat Office</h3>
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-jf-lime" />
                  <span>207, Richmond Plaza, Nr. Swastik Milestone, Above Dhiraj Sons, Vesu, Surat – 395007</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-jf-lime" />
                  <a href="tel:+917069536308" className="hover:text-white">+91 7069536308</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-jf-lime" />
                  <a href="mailto:jayrajfab09@gmail.com" className="hover:text-white">jayrajfab09@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="overflow-hidden rounded-xl border border-white/10 aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.2456!2d73.1856!3d22.3173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5873b0f83a7%3A0x1!2sKarelibaug%2C+Vadodara!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jayraj Fabrication Vadodara Office"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

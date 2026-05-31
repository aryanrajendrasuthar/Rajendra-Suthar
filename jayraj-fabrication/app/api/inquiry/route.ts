/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.json();
    const { name, company, phone, email, city, service, description, contact_pref, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbErr } = await supabase.from("inquiries").insert({
      name, company, phone, email, city,
      service: service || null,
      description, contact_pref, source,
    });

    if (dbErr) {
      console.error("DB error:", dbErr);
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    // Send email via Resend (if configured)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "noreply@jayrajfabrication.com",
          to: [process.env.EMAIL_TO_ADMIN ?? "aryanrajendrasuthar@gmail.com"],
          subject: `New Inquiry — ${name} (${service ?? "General"})`,
          html: `
            <h2>New Inquiry from Jayraj Fabrication Website</h2>
            <table>
              <tr><td><b>Name</b></td><td>${name}</td></tr>
              <tr><td><b>Company</b></td><td>${company ?? "—"}</td></tr>
              <tr><td><b>Phone</b></td><td>${phone}</td></tr>
              <tr><td><b>Email</b></td><td>${email ?? "—"}</td></tr>
              <tr><td><b>City</b></td><td>${city ?? "—"}</td></tr>
              <tr><td><b>Service</b></td><td>${service ?? "—"}</td></tr>
              <tr><td><b>Contact Pref</b></td><td>${contact_pref ?? "—"}</td></tr>
              <tr><td><b>Source</b></td><td>${source ?? "—"}</td></tr>
            </table>
            <h3>Project Brief</h3>
            <p>${description}</p>
          `,
        }),
      }).catch(console.error);

      // Auto-reply to client if email provided
      if (email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM ?? "noreply@jayrajfabrication.com",
            to: [email],
            subject: "Your Inquiry — Jayraj Fabrication",
            html: `
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to <b>Jayraj Fabrication</b>. We have received your inquiry and our team will get back to you within 24 hours.</p>
              <p>For urgent queries, you can reach us at:<br/>
              📞 +91 9825098819 | +91 7069536308<br/>
              📧 jayrajfab09@gmail.com</p>
              <p>Warm regards,<br/>Team Jayraj Fabrication</p>
            `,
          }),
        }).catch(console.error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

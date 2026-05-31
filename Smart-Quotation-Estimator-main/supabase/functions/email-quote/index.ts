import { adminGuard, json } from "../_shared/adminGuard.ts";

type Payload = { to: string; subject: string; message?: string; pdfUrl: string };

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "POST only" });

  const guard = await adminGuard(req);
  if (!guard.ok) return json(guard.status, { error: guard.message });

  let payload: Payload;
  try { payload = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
  const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "Jayraj Fabrication <onboarding@resend.dev>";

  if (!payload?.to || !payload?.subject || !payload?.pdfUrl) {
    return json(400, { error: "to, subject, pdfUrl required" });
  }

  if (!RESEND_API_KEY) {
    return json(200, { sent: false, reason: "Missing RESEND_API_KEY. Returning pdfUrl only.", pdfUrl: payload.pdfUrl });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4">
      <p>${payload.message ? payload.message : "Please find the quotation link below:"}</p>
      <p><a href="${payload.pdfUrl}">Download Quotation PDF</a></p>
      <p>Regards,<br/>Jayraj Fabrication</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html
    })
  });

  if (!res.ok) return json(500, { error: "Resend failed", details: await res.text(), pdfUrl: payload.pdfUrl });

  return json(200, { sent: true, pdfUrl: payload.pdfUrl, resend: await res.json() });
});
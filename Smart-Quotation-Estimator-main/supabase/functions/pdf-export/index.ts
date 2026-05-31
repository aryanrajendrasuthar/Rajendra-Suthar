import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { adminGuard, json } from "../_shared/adminGuard.ts";

type QuotePayload = { quoteId: number };

function money(n: number) {
  return "Rs. " + n.toFixed(2) + "/-";
}
function safeLines(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(x => String(x ?? "").trim()).filter(Boolean);
}
async function fetchBytes(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  return new Uint8Array(await res.arrayBuffer());
}
function drawText(page: any, text: string, x: number, y: number, size: number, font: any) {
  page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
}
function drawLine(page: any, x1: number, y1: number, x2: number, y2: number, thickness = 1) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color: rgb(0,0,0) });
}
function drawRect(page: any, x: number, y: number, w: number, h: number, thickness = 1) {
  page.drawRectangle({ x, y, width: w, height: h, borderWidth: thickness, borderColor: rgb(0,0,0) });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "POST only" });

  const guard = await adminGuard(req);
  if (!guard.ok) return json(guard.status, { error: guard.message });

  let payload: QuotePayload;
  try { payload = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }
  if (!payload?.quoteId) return json(400, { error: "quoteId required" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ASSETS_BUCKET = Deno.env.get("ASSETS_BUCKET") || "assets";
  const EXPORTS_BUCKET = Deno.env.get("EXPORTS_BUCKET") || "exports";
  const supabase = guard.supabaseAdmin;

  const { data: company } = await supabase
    .from("company_profile")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!company) return json(500, { error: "company_profile missing" });

  const { data: quote, error: qErr } = await supabase
    .from("quotes")
    .select("*, clients(*)")
    .eq("id", payload.quoteId)
    .maybeSingle();
  if (qErr) return json(500, { error: qErr.message });
  if (!quote) return json(404, { error: "Quote not found" });

  const { data: items, error: iErr } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", payload.quoteId)
    .order("line_no", { ascending: true });
  if (iErr) return json(500, { error: iErr.message });

  const { data: extras, error: eErr } = await supabase
    .from("quote_extras")
    .select("*")
    .eq("quote_id", payload.quoteId)
    .order("line_no", { ascending: true });
  if (eErr) return json(500, { error: eErr.message });

  // Load logo from public assets bucket path
  let logoBytes: Uint8Array | null = null;
  try {
    const logoPath = String(company.logo_path || `${ASSETS_BUCKET}/logo.jpg`).replace(/^\//, "");
    const publicLogoUrl = `${SUPABASE_URL}/storage/v1/object/public/${logoPath}`;
    logoBytes = await fetchBytes(publicLogoUrl);
  } catch {
    logoBytes = null;
  }

  // Create PDF A4
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const { width, height } = page.getSize();
  const left = 40;
  const right = width - 40;
  let y = height - 40;

  // Logo (top center)
  if (logoBytes) {
    try {
      const img = await pdf.embedJpg(logoBytes);
      const w = 160;
      const h = (img.height / img.width) * w;
      page.drawImage(img, { x: (width - w) / 2, y: y - h, width: w, height: h });
      y -= h + 10;
    } catch {}
  } else {
    y -= 20;
  }

  // Quote No (top-right)
  drawText(page, `QUOTATION NO: ${quote.quote_no}`, right - 200, y, 12, bold);
  y -= 18;

  // To/Date/Kind Attn
  const clientName = quote.to_name || quote.clients?.name || "";
  const clientAddr = safeLines((quote.to_address_lines?.length ? quote.to_address_lines : quote.clients?.address_lines) || []);

  drawText(page, "To,", left, y, 12, bold);
  drawText(page, `Date: ${quote.quote_date}`, right - 120, y, 12, bold);
  y -= 16;

  drawText(page, String(clientName), left, y, 12, font);
  if (quote.kind_attn) drawText(page, `Kind Attn: ${quote.kind_attn}`, right - 200, y, 12, font);
  y -= 14;

  for (const line of clientAddr.slice(0, 3)) {
    drawText(page, line, left, y, 11, font);
    y -= 13;
  }
  y -= 4;

  // Subject
  drawText(page, "SUBJECT:", left, y, 12, bold);
  drawText(page, String(quote.subject || ""), left + 70, y, 12, bold);
  y -= 20;

  // Table columns (NO, PARTICULARS, QTY, RATE, AMOUNT)
  const colNo = left;
  const colPart = left + 45;
  const colQty = left + 330;
  const colRate = left + 410;
  const colAmt = left + 490;

  // Header row
  const headerH = 22;
  drawRect(page, left, y - headerH, right - left, headerH, 1);
  drawLine(page, colPart - 5, y, colPart - 5, y - headerH);
  drawLine(page, colQty - 5, y, colQty - 5, y - headerH);
  drawLine(page, colRate - 5, y, colRate - 5, y - headerH);
  drawLine(page, colAmt - 5, y, colAmt - 5, y - headerH);

  drawText(page, "NO.", colNo + 5, y - 16, 11, bold);
  drawText(page, "PARTICULARS", colPart, y - 16, 11, bold);
  drawText(page, "QTY", colQty, y - 16, 11, bold);
  drawText(page, "RATE", colRate, y - 16, 11, bold);
  drawText(page, "AMOUNT", colAmt, y - 16, 11, bold);

  y -= headerH;

  // Items
  let total = 0;
  for (const it of (items || [])) {
    const lineNo = Number(it.line_no ?? 0);
    const title = String(it.title ?? "");
    const includeLines = safeLines(it.include_lines);

    const lines = [title];
    if (includeLines.length) {
      lines.push("Including:");
      for (const l of includeLines) lines.push(`• ${l}`);
    }

    const qty = Number(it.qty ?? 0);
    const unit = String(it.unit ?? "");
    const rate = Number(it.rate ?? 0);
    const amount = Number(it.amount ?? (qty * rate));
    total += amount;

    const lineH = 12;
    const rowH = Math.max(26, lines.length * lineH + 10);

    drawRect(page, left, y - rowH, right - left, rowH, 1);
    drawLine(page, colPart - 5, y, colPart - 5, y - rowH);
    drawLine(page, colQty - 5, y, colQty - 5, y - rowH);
    drawLine(page, colRate - 5, y, colRate - 5, y - rowH);
    drawLine(page, colAmt - 5, y, colAmt - 5, y - rowH);

    drawText(page, String(lineNo), colNo + 8, y - 16, 11, font);

    let py = y - 14;
    for (const l of lines) {
      drawText(page, l, colPart, py, 10.5, font);
      py -= lineH;
    }

    drawText(page, `${qty.toFixed(2)} ${unit}`, colQty, y - 16, 11, font);
    drawText(page, money(rate), colRate, y - 16, 11, font);
    drawText(page, money(amount), colAmt, y - 16, 11, font);

    y -= rowH;
  }

  // Total
  y -= 10;
  drawText(page, "TOTAL:", colRate, y, 12, bold);
  drawText(page, money(total), colAmt, y, 12, bold);
  y -= 18;

  // Extras (EXTRA or AMOUNT)
  for (const ex of (extras || [])) {
    const label = String(ex.label ?? "");
    const t = String(ex.extra_type ?? "EXTRA_TEXT");
    if (t === "AMOUNT") {
      drawText(page, label, colRate - 140, y, 11, font);
      drawText(page, money(Number(ex.amount ?? 0)), colAmt, y, 11, font);
    } else {
      drawText(page, `${label} EXTRA`, colRate - 140, y, 11, font);
    }
    y -= 14;
  }

  y -= 6;

  // Notes
  const notes = safeLines(quote.notes_lines);
  if (notes.length) {
    drawText(page, "NOTE:", left, y, 12, bold);
    y -= 14;
    for (const n of notes) {
      drawText(page, n, left, y, 10.5, font);
      y -= 12;
    }
    y -= 6;
  }

  // Terms
  const terms = safeLines(quote.terms_lines);
  if (terms.length) {
    drawText(page, "TERM'S & CONDITIONS:", left, y, 12, bold);
    y -= 14;
    let i = 1;
    for (const t of terms) {
      drawText(page, `${i}. ${t}`, left, y, 10.5, font);
      y -= 12;
      i++;
    }
    y -= 6;
  }

  // Signature block
  drawText(page, "Thanking you,", left, y, 11, font);
  y -= 30;

  drawText(page, "For, " + String(company.company_name || ""), left, y, 11, bold);
  y -= 38;

  if (company.signature_name) drawText(page, String(company.signature_name), left, y, 11, bold);
  y -= 14;

  if (company.phone) drawText(page, `Mo. ${company.phone}`, left, y, 11, font);

  const bytes = await pdf.save();

  // Upload to Storage
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = `${quote.quote_no}-${stamp}.pdf`;

  const up = await supabase.storage.from(EXPORTS_BUCKET).upload(file, bytes, { contentType: "application/pdf" });
  if (up.error) return json(500, { error: up.error.message });

  // URL (public if bucket public; else signed)
  let url: string | null = null;
  const pub = supabase.storage.from(EXPORTS_BUCKET).getPublicUrl(file);
  if (pub?.data?.publicUrl) url = pub.data.publicUrl;

  if (!url) {
    const signed = await supabase.storage.from(EXPORTS_BUCKET).createSignedUrl(file, 60 * 60 * 24 * 7);
    url = signed.data?.signedUrl ?? null;
  }

  await supabase.from("quote_exports").insert({
    quote_id: payload.quoteId,
    storage_path: `${EXPORTS_BUCKET}/${file}`,
    public_url: url
  });

  return json(200, { quoteId: payload.quoteId, storagePath: `${EXPORTS_BUCKET}/${file}`, url });
});
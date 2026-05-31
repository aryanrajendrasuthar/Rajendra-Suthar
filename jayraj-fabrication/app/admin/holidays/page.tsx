/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const FESTIVALS = [
  { name: "Makar Sankranti / Uttarayan", date: "2025-01-14", bg: "#87CEEB", accent: "#FFD700", emoji: "🪁", greeting: "Jai Uttarayan!" },
  { name: "Republic Day",               date: "2025-01-26", bg: "#FF9933", accent: "#138808", emoji: "🇮🇳", greeting: "Happy Republic Day!" },
  { name: "Mahashivratri",              date: "2025-02-26", bg: "#4B0082", accent: "#C0C0C0", emoji: "🔱", greeting: "Har Har Mahadev!" },
  { name: "Holi",                        date: "2025-03-14", bg: "#FF69B4", accent: "#FFD700", emoji: "🎨", greeting: "Happy Holi!" },
  { name: "Eid ul-Fitr",                date: "2025-03-31", bg: "#006400", accent: "#FFD700", emoji: "🌙", greeting: "Eid Mubarak!" },
  { name: "Independence Day",           date: "2025-08-15", bg: "#FF9933", accent: "#138808", emoji: "🇮🇳", greeting: "Happy Independence Day!" },
  { name: "Raksha Bandhan",             date: "2025-08-09", bg: "#FF69B4", accent: "#FFD700", emoji: "🎀", greeting: "Happy Raksha Bandhan!" },
  { name: "Janmashtami",                date: "2025-08-16", bg: "#00008B", accent: "#FFD700", emoji: "🦚", greeting: "Happy Janmashtami!" },
  { name: "Ganesh Chaturthi",           date: "2025-08-27", bg: "#FF8C00", accent: "#FFD700", emoji: "🐘", greeting: "Ganpati Bappa Morya!" },
  { name: "Navratri",                   date: "2025-09-22", bg: "#8B0000", accent: "#FFD700", emoji: "💃", greeting: "Happy Navratri!" },
  { name: "Dussehra",                   date: "2025-10-02", bg: "#FF8C00", accent: "#006400", emoji: "🏹", greeting: "Happy Dussehra!" },
  { name: "Diwali",                     date: "2025-10-20", bg: "#1A1A00", accent: "#FFD700", emoji: "🪔", greeting: "Shubh Diwali!" },
  { name: "Gujarati New Year",          date: "2025-10-22", bg: "#1A1A00", accent: "#FFD700", emoji: "🎊", greeting: "Saal Mubarak!" },
  { name: "Labh Pancham",              date: "2025-10-25", bg: "#006400", accent: "#FFD700", emoji: "🙏", greeting: "Labh Pancham Shubhecha!" },
  { name: "Christmas",                 date: "2025-12-25", bg: "#006400", accent: "#FFD700", emoji: "🎄", greeting: "Merry Christmas!" },
  { name: "New Year 2026",             date: "2026-01-01", bg: "#000033", accent: "#FFD700", emoji: "🎆", greeting: "Happy New Year 2026!" },
  { name: "Generic Brand Card",        date: "",           bg: "#0D0D0D", accent: "#6BBF3A", emoji: "◆", greeting: "Wishing you all the best!" },
];

type Format = "square" | "story";

export default function HolidaysPage() {
  const [selectedFestival, setSelectedFestival] = useState(FESTIVALS[0]);
  const [greeting, setGreeting] = useState(FESTIVALS[0].greeting);
  const [format, setFormat] = useState<Format>("square");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const supabase = createClient();

  const SIZE = format === "square" ? 1080 : 608; // preview at 608px; actual 1080×1920

  function daysUntil(dateStr: string) {
    if (!dateStr) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(dateStr); d.setHours(0,0,0,0);
    return Math.ceil((d.getTime() - today.getTime()) / 86400000);
  }

  useEffect(() => {
    drawCanvas();
  }, [selectedFestival, greeting, format, SIZE]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const f = selectedFestival;

    // Background
    ctx.fillStyle = f.bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid pattern
    ctx.strokeStyle = f.accent + "15";
    ctx.lineWidth = 1;
    const step = W / 12;
    for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Lime accent top bar
    ctx.fillStyle = "#6BBF3A";
    ctx.fillRect(0, 0, W, W * 0.015);

    // Lime accent bottom area
    ctx.fillStyle = "#6BBF3A";
    ctx.fillRect(0, H - W * 0.22, W, W * 0.22);

    // Festival emoji (big)
    const emojiSize = Math.round(W * 0.25);
    ctx.font = `${emojiSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(f.emoji, W / 2, H * 0.38);

    // Greeting text
    const greetSize = Math.round(W * 0.065);
    ctx.font = `bold ${greetSize}px 'Arial', sans-serif`;
    ctx.fillStyle = f.accent;
    ctx.textAlign = "center";
    ctx.fillText(greeting, W / 2, H * 0.58);

    // Company name on lime bottom
    ctx.fillStyle = "#0D0D0D";
    ctx.font = `bold ${Math.round(W * 0.045)}px 'Arial', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("JAYRAJ FABRICATION", W / 2, H - W * 0.12);

    ctx.font = `${Math.round(W * 0.025)}px 'Arial', sans-serif`;
    ctx.fillStyle = "#0D0D0D90";
    ctx.fillText("— Roofing Solutions Under One Roof —", W / 2, H - W * 0.07);

    ctx.font = `${Math.round(W * 0.022)}px 'Arial', sans-serif`;
    ctx.fillText("+91 9825098819 | jayrajfab09@gmail.com", W / 2, H - W * 0.035);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // For actual 1080p, draw to an off-screen 1080×1080 (or 1080×1920) canvas
    const realCanvas = document.createElement("canvas");
    realCanvas.width = 1080;
    realCanvas.height = format === "square" ? 1080 : 1920;
    const realCtx = realCanvas.getContext("2d")!;
    realCtx.drawImage(canvas, 0, 0, realCanvas.width, realCanvas.height);

    const url = realCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = `jayraj-${selectedFestival.name.replace(/\s+/g, "-").toLowerCase()}-${format}.png`;
    a.href = url;
    a.click();

    // Log to DB
    supabase.from("generated_cards").insert({
      festival_name: selectedFestival.name,
      festival_date: selectedFestival.date || null,
      template_used: selectedFestival.emoji,
      format,
      custom_message: greeting,
    }).then(() => {});
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/919825098819?text=${encodeURIComponent(`Greetings from Jayraj Fabrication! ${greeting}`)}`, "_blank");
  }

  const canvasWidth = format === "square" ? SIZE : Math.round(SIZE * (9 / 16));
  const canvasHeight = format === "square" ? SIZE : SIZE;

  return (
    <div className="space-y-5">
      <div>
        <p className="section-label">Marketing</p>
        <h2 className="font-heading text-2xl font-bold text-white">Holiday Card Generator</h2>
        <p className="text-sm text-white/40">Generate WhatsApp + Instagram cards for festivals</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          <div className="admin-card space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-jf-lime" /> Select Festival
            </h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {FESTIVALS.map((f) => {
                const days = daysUntil(f.date);
                return (
                  <button key={f.name}
                    onClick={() => { setSelectedFestival(f); setGreeting(f.greeting); }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedFestival.name === f.name
                        ? "bg-jf-lime/20 border border-jf-lime/50 text-jf-lime"
                        : "border border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    }`}>
                    <span>{f.emoji} {f.name}</span>
                    {days !== null && days >= 0 && (
                      <span className={`text-xs font-mono-jf ${days <= 7 ? "text-amber-400" : "text-white/30"}`}>
                        {days === 0 ? "Today!" : `${days}d`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="admin-card space-y-4">
            <div>
              <label className="admin-label">Custom Greeting</label>
              <input className="admin-input" value={greeting}
                onChange={(e) => setGreeting(e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Format</label>
              <div className="flex gap-2">
                {(["square", "story"] as Format[]).map((fmt) => (
                  <button key={fmt} onClick={() => setFormat(fmt)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors ${
                      format === fmt
                        ? "border-jf-lime bg-jf-lime/10 text-jf-lime"
                        : "border-white/10 text-white/50 hover:border-white/30"
                    }`}>
                    {fmt === "square" ? "Square (1080×1080)" : "Story (1080×1920)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleDownload} className="btn-lime flex-1 justify-center">
                <Download className="h-4 w-4" /> Download PNG
              </button>
              <button onClick={handleWhatsApp} className="btn-outline flex-1 justify-center">
                <Share2 className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs text-white/30">Preview (rendered in browser)</div>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="max-w-full"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

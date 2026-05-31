/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useState, useMemo } from "react";
import {
  angleSections, beamSections, channelSections, pipeSections,
  recTubeSections, sqrTubeSections, barFlatData,
  type AngleSection, type BeamSection,
} from "@/lib/steelData";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

type Tab = "angle" | "beam" | "channel" | "pipe" | "rect" | "square" | "bar";

const TABS: { key: Tab; label: string }[] = [
  { key: "angle",   label: "Angle"     },
  { key: "beam",    label: "Beam"      },
  { key: "channel", label: "Channel"   },
  { key: "pipe",    label: "Pipe"      },
  { key: "rect",    label: "Rec Tube"  },
  { key: "square",  label: "Sqr Tube"  },
  { key: "bar",     label: "Bar/Flats" },
];

function rupees(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}
function kg(n: number) {
  return n.toFixed(3) + " kg";
}

export default function SteelTablePage() {
  const [activeTab, setActiveTab] = useState<Tab>("angle");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [length, setLength] = useState("");
  const [rate, setRate] = useState("");
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => {
    switch (activeTab) {
      case "angle":   return angleSections;
      case "beam":    return beamSections;
      case "channel": return channelSections;
      case "pipe":    return pipeSections;
      case "rect":    return recTubeSections;
      case "square":  return sqrTubeSections;
      default:        return [];
    }
  }, [activeTab]);

  const selected = sections[selectedIdx] ?? null;
  const weightPerMetre = selected ? (selected as AngleSection).W ?? (selected as BeamSection).W : 0;
  const totalWeight = weightPerMetre * Number(length || 0);
  const totalPrice = totalWeight * Number(rate || 0);

  async function copyProperties() {
    if (!selected) return;
    const text = Object.entries(selected).map(([k, v]) => `${k}: ${v}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const newQuoteItem = selected
    ? `/admin/smartquote/new?section=${encodeURIComponent(selected.size)}&weight=${weightPerMetre}`
    : "#";

  function renderPropertiesTable() {
    if (!selected) return null;
    const entries = Object.entries(selected).filter(([k]) => k !== "size");
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-left font-mono-jf text-xs text-white/40 w-32">Property</th>
              <th className="pb-2 text-right font-mono-jf text-xs text-white/40">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map(([key, val]) => (
              <tr key={key}>
                <td className="py-1.5 font-mono-jf text-xs text-white/50">{key}</td>
                <td className="py-1.5 text-right font-mono-jf text-sm font-medium text-jf-lime">
                  {val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="section-label">Reference Tool</p>
        <h2 className="font-heading text-2xl font-bold text-white">ISS Steel Table</h2>
        <p className="text-sm text-white/40">IS section properties for structural calculations</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-white/10 pb-0">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedIdx(0); }}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-jf-lime text-jf-lime"
                : "border-transparent text-white/50 hover:text-white"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "bar" ? (
        /* Bar/Flats table */
        <div className="admin-card overflow-x-auto">
          <h3 className="font-semibold text-white mb-4">Round Bar & Square Bar Properties</h3>
          <table className="min-w-full text-sm font-mono-jf">
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/40">
                <th className="pb-2 text-left">Size (mm)</th>
                <th className="pb-2 text-right">Round Area (cm²)</th>
                <th className="pb-2 text-right">Round kg/m</th>
                <th className="pb-2 text-right">Sqr Area (cm²)</th>
                <th className="pb-2 text-right">Sqr kg/m</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {barFlatData.map((row) => (
                <tr key={row.thk} className="hover:bg-white/5">
                  <td className="py-2 text-jf-lime font-bold">{row.thk}</td>
                  <td className="py-2 text-right text-white/70">{row.roundArea}</td>
                  <td className="py-2 text-right text-white">{row.roundKgm}</td>
                  <td className="py-2 text-right text-white/70">{row.sqrArea}</td>
                  <td className="py-2 text-right text-white">{row.sqrKgm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Section selector + properties */}
          <div className="admin-card space-y-4">
            <div>
              <label className="admin-label">Select Size</label>
              <select className="admin-input font-mono-jf" value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}>
                {sections.map((s, i) => (
                  <option key={i} value={i}>{s.size}</option>
                ))}
              </select>
            </div>

            {selected && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-mono-jf text-base font-bold text-jf-lime">{selected.size}</h3>
                  <div className="flex gap-2">
                    <button onClick={copyProperties} className="btn-ghost text-xs">
                      {copied ? <Check className="h-3.5 w-3.5 text-jf-lime" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <Link href={newQuoteItem} className="btn-ghost text-xs">
                      <ExternalLink className="h-3.5 w-3.5" />
                      To Quote
                    </Link>
                  </div>
                </div>
                {renderPropertiesTable()}
              </>
            )}
          </div>

          {/* Weight & Price Calculator */}
          <div className="admin-card space-y-5">
            <h3 className="font-semibold text-white">Weight & Price Calculator</h3>

            <div className="rounded-lg border border-jf-lime/20 bg-jf-lime/5 p-3">
              <div className="text-xs text-white/40">Selected Section</div>
              <div className="font-mono-jf text-sm text-jf-lime">{selected?.size ?? "—"}</div>
              <div className="font-mono-jf text-2xl font-bold text-white mt-1">
                W = {weightPerMetre.toFixed(3)} <span className="text-sm font-normal text-white/40">kg/m</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="admin-label">Length (metres)</label>
                <input type="number" min="0" step="0.01" className="admin-input font-mono-jf"
                  placeholder="e.g. 6.0" value={length} onChange={(e) => setLength(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Rate (₹ per kg)</label>
                <input type="number" min="0" step="0.5" className="admin-input font-mono-jf"
                  placeholder="e.g. 75.00" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-jf-bg-3 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Total Weight</span>
                <span className="font-mono-jf text-white font-bold">{kg(totalWeight)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50">Total Price</span>
                <span className="font-mono-jf text-lg font-bold text-jf-lime">{rupees(totalPrice)}</span>
              </div>
            </div>

            <p className="text-xs text-white/30">
              W = {weightPerMetre.toFixed(3)} × {length || "0"} m = {totalWeight.toFixed(3)} kg
              {rate ? ` × ₹${rate}/kg = ${rupees(totalPrice)}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

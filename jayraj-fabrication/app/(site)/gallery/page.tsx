/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageIcon } from "lucide-react";

const CATEGORIES = [
  { key: "all",               label: "All"           },
  { key: "industrial_peb",    label: "Industrial/PEB" },
  { key: "tensile",           label: "Tensile"        },
  { key: "elevation",         label: "Elevation"      },
  { key: "commercial",        label: "Commercial"     },
  { key: "residential",       label: "Residential"    },
  { key: "roofing",           label: "Roofing"        },
];

type GalleryImage = { id: number; public_url: string; category: string; description: string | null };

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // createClient() is called inside useEffect — browser only, never during SSR
    const supabase = createClient();
    async function load() {
      setLoading(true);
      let q = supabase.from("gallery_images").select("id, public_url, category, description").eq("is_active", true).order("sort_order").order("id", { ascending: false });
      if (activeCategory !== "all") q = q.eq("category", activeCategory);
      const { data } = await q.limit(48);
      setImages((data ?? []) as GalleryImage[]);
      setLoading(false);
    }
    load();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-jf-bg pt-24">
      {/* Hero */}
      <div className="bg-jf-bg-section border-b border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="section-label mb-3">Portfolio</p>
          <h1 className="section-heading text-white">OUR WORK</h1>
          <p className="section-subheading mt-4">200+ projects delivered across India</p>
        </div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-16 z-10 border-b border-white/10 bg-jf-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === c.key
                    ? "bg-jf-lime text-black"
                    : "text-white/50 hover:text-white border border-white/10 hover:border-white/30"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-white/30">
            <ImageIcon className="h-12 w-12" />
            <p>Gallery images will appear here once uploaded via the Admin Panel.</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-jf-bg-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.public_url}
                  alt={img.description ?? "Jayraj Fabrication project"}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {img.description && (
                  <div className="px-3 py-2">
                    <p className="text-xs text-white/50 truncate">{img.description}</p>
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

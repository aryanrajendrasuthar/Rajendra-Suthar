/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageIcon, Trash2, Star, Eye, EyeOff, Upload } from "lucide-react";

type GalleryImage = {
  id: number; cloudinary_id: string; public_url: string; category: string;
  description: string | null; is_featured: boolean; is_active: boolean; sort_order: number;
};

const CATEGORIES = [
  { key: "industrial_peb",  label: "Industrial/PEB"  },
  { key: "tensile",         label: "Tensile"          },
  { key: "elevation",       label: "Elevation/Façade" },
  { key: "commercial",      label: "Commercial"       },
  { key: "residential",     label: "Residential"      },
  { key: "roofing",         label: "Roofing"          },
];

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("all");
  const supabase = createClient();

  async function load() {
    setLoading(true);
    let q = supabase.from("gallery_images").select("*").order("sort_order").order("id", { ascending: false });
    if (filterCat !== "all") q = q.eq("category", filterCat);
    const { data } = await q;
    setImages((data ?? []) as GalleryImage[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filterCat]);

  async function toggleFeatured(img: GalleryImage) {
    await supabase.from("gallery_images").update({ is_featured: !img.is_featured }).eq("id", img.id);
    setImages(images.map((i) => i.id === img.id ? { ...i, is_featured: !img.is_featured } : i));
  }

  async function toggleActive(img: GalleryImage) {
    await supabase.from("gallery_images").update({ is_active: !img.is_active }).eq("id", img.id);
    setImages(images.map((i) => i.id === img.id ? { ...i, is_active: !img.is_active } : i));
  }

  async function deleteImage(img: GalleryImage) {
    if (!confirm(`Delete image from "${img.category}"?`)) return;
    await supabase.from("gallery_images").delete().eq("id", img.id);
    setImages(images.filter((i) => i.id !== img.id));
  }

  async function updateCategory(img: GalleryImage, category: string) {
    await supabase.from("gallery_images").update({ category }).eq("id", img.id);
    setImages(images.map((i) => i.id === img.id ? { ...i, category } : i));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-label">Media</p>
          <h2 className="font-heading text-2xl font-bold text-white">Gallery Manager</h2>
          <p className="text-sm text-white/40">{images.length} images · {images.filter((i) => i.is_featured).length} featured</p>
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="admin-card border-jf-lime/20 bg-jf-lime/5 space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-jf-lime" />
          <h3 className="font-semibold text-jf-lime">How to Upload Gallery Images</h3>
        </div>
        <ol className="space-y-1.5 text-sm text-white/60 list-decimal pl-5">
          <li>Upload images to <span className="font-mono-jf text-white">Cloudinary</span> under folder <span className="font-mono-jf text-jf-lime">jayraj-fabrication/gallery/{"{category}"}{"/"}</span></li>
          <li>Use folder names: <span className="font-mono-jf text-jf-lime">industrial-peb | tensile | elevation-facade | commercial | residential | roofing</span></li>
          <li>After upload, add the Cloudinary URL + public_id to the database via Supabase dashboard or insert below</li>
          <li>Mark best 6-8 photos per category as <strong className="text-white">Featured</strong> — they appear on the homepage</li>
        </ol>
        <p className="text-xs text-white/30">The 7GB gallery upload is a one-time manual task. Plan multiple sessions by category.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        <button onClick={() => setFilterCat("all")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCat === "all" ? "bg-jf-lime text-black" : "border border-white/10 text-white/50 hover:text-white"}`}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => setFilterCat(c.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCat === c.key ? "bg-jf-lime text-black" : "border border-white/10 text-white/50 hover:text-white"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-jf-lime border-t-transparent" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-white/30">
          <ImageIcon className="h-10 w-10" />
          <p className="text-sm">No images yet. Upload via Cloudinary and add records here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-jf-bg-2 aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.public_url} alt="" className="h-full w-full object-cover" loading="lazy" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/70 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                <div className="flex justify-between">
                  <button onClick={() => toggleFeatured(img)} title="Toggle featured"
                    className={`rounded p-1 transition-colors ${img.is_featured ? "text-amber-400 bg-amber-400/20" : "text-white/50 hover:text-amber-400"}`}>
                    <Star className="h-4 w-4" fill={img.is_featured ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => deleteImage(img)} className="rounded p-1 text-red-400 hover:bg-red-400/20">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <select
                    className="w-full rounded border border-white/20 bg-black/60 px-1.5 py-1 text-xs text-white"
                    value={img.category}
                    onChange={(e) => updateCategory(img, e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                  <button onClick={() => toggleActive(img)}
                    className={`flex w-full items-center gap-1 rounded px-1.5 py-1 text-xs ${img.is_active ? "text-jf-lime" : "text-white/40"}`}>
                    {img.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {img.is_active ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>

              {/* Badges */}
              {img.is_featured && (
                <div className="absolute left-1.5 top-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                </div>
              )}
              {!img.is_active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <EyeOff className="h-6 w-6 text-white/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

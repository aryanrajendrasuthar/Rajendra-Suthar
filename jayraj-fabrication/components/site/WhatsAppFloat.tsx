"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/919825098819"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-all hover:scale-110 hover:shadow-[#25D366]/50 active:scale-95"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" />
    </Link>
  );
}

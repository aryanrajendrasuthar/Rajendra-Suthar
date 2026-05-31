"use client";

import { useState } from "react";
import { Menu, LogOut, User, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  title: string;
  onMenuClick: () => void;
  userEmail?: string | null;
}

export default function AdminTopbar({ title, onMenuClick, userEmail }: Props) {
  const [signingOut, setSigningOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-white/10 bg-jf-bg-2 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-base font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="btn-ghost hidden items-center gap-1.5 text-xs sm:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Site
        </Link>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-jf-bg-3 px-3 py-1.5">
          <User className="h-3.5 w-3.5 text-jf-lime" />
          <span className="hidden text-xs text-white/60 sm:block">
            {userEmail ?? "Admin"}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="btn-ghost text-xs text-white/60 hover:text-red-400"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

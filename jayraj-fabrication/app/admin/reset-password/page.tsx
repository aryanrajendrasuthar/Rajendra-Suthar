/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Diamond, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const validPassword =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validPassword) {
      setError("Password must be at least 8 chars, include an uppercase letter and a number.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-jf-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jf-lime">
            <Diamond className="h-6 w-6 text-black" />
          </div>
          <div className="font-display text-2xl font-bold uppercase tracking-wider text-white">
            JAYRAJ FABRICATION
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-jf-bg-2 p-6">
          <h2 className="mb-5 text-center text-lg font-semibold text-white">
            Set new password
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-jf-lime">
              <CheckCircle className="h-10 w-10" />
              <p className="text-sm">Password updated! Redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="admin-label">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, uppercase + number"
                    className="admin-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="admin-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="admin-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-lime w-full justify-center py-2.5"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

type Mode = "login" | "forgot";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(`Reset link sent to ${email}. Check your inbox.`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-jf-bg px-4">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#6BBF3A 1px, transparent 1px), linear-gradient(90deg, #6BBF3A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/logo/jf-logo.jpeg"
            alt="Jayraj Fabrication"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
          <div className="text-xs tracking-[0.3em] text-white/40 uppercase">
            Admin Panel
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-jf-bg-2 p-6">
          <h2 className="mb-5 text-center text-lg font-semibold text-white">
            {mode === "login" ? "Sign in to your account" : "Reset your password"}
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-jf-lime/30 bg-jf-lime/10 p-3 text-sm text-jf-lime">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleForgotPassword} className="space-y-4">
            <div>
              <label className="admin-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="admin-input"
                autoComplete="email"
              />
            </div>

            {mode === "login" && (
              <div>
                <label className="admin-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="admin-input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-lime w-full justify-center py-2.5"
            >
              {loading
                ? mode === "login"
                  ? "Signing in…"
                  : "Sending…"
                : mode === "login"
                ? "Sign In"
                : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <button
                onClick={() => { setMode("forgot"); setError(null); setSuccess(null); }}
                className="text-white/40 hover:text-jf-lime transition-colors"
              >
                Forgot password?
              </button>
            ) : (
              <button
                onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                className="text-white/40 hover:text-jf-lime transition-colors"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/20">
          Jayraj Fabrication © 2025 · Aryan Rajendra Suthar
        </div>
      </div>
    </div>
  );
}

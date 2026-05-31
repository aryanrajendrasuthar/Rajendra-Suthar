import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-md pt-16">
      <div className="card">
        <div className="flex items-center gap-3">
          <img src="/jayraj-logo.jpg" className="h-12 w-12 rounded-full border border-white/10 object-cover" />
          <div>
            <div className="text-xl font-bold">Jayraj Fabrication</div>
            <div className="text-sm text-white/60">Admin Login</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button
            className="btn w-full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setErr(null);
              const e = await signIn(email, password);
              setBusy(false);
              if (e) return setErr(e);
              nav("/quotes");
            }}
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
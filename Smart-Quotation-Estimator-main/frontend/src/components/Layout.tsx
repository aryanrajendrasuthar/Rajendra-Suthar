import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/quotes", label: "Quotes" },
  { to: "/clients", label: "Clients" },
  { to: "/company", label: "Company" }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/jayraj-logo.jpg" className="h-10 w-10 rounded-full border border-white/10 object-cover" />
            <div>
              <div className="text-lg font-bold">SmartQuote</div>
              <div className="text-xs text-white/60">Jayraj Fabrication</div>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            {nav.map(n => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={active ? "text-brand-accent font-semibold" : "text-white/70 hover:text-white"}
                >
                  {n.label}
                </Link>
              );
            })}
            <button className="btn" onClick={signOut}>Logout</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
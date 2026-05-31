import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Client = { id: number; name: string; address_lines: string[] };

export default function Clients() {
  const [rows, setRows] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");

  async function load() {
    const { data, error } = await supabase.from("clients").select("id,name,address_lines").order("id", { ascending: false });
    if (error) return alert(error.message);
    setRows((data || []) as Client[]);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold">Clients</div>
        <div className="text-white/60 text-sm">Save client address for quick quoting.</div>
      </div>

      <div className="card space-y-3">
        <div className="text-lg font-semibold">Add Client</div>
        <input className="input" placeholder="Client name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="input min-h-[90px]" placeholder="Address lines (one per line)" value={addr} onChange={e => setAddr(e.target.value)} />
        <button className="btn" onClick={async () => {
          const { error } = await supabase.from("clients").insert({
            name,
            address_lines: addr.split("\n").map(s => s.trim()).filter(Boolean)
          });
          if (error) return alert(error.message);
          setName(""); setAddr("");
          await load();
        }}>Save</button>
      </div>

      <div className="card">
        <div className="divide-y divide-white/10">
          {rows.map(r => (
            <div key={r.id} className="py-3">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-white/60 whitespace-pre-line">{(r.address_lines || []).join("\n")}</div>
            </div>
          ))}
          {rows.length === 0 && <div className="py-8 text-white/60">No clients yet.</div>}
        </div>
      </div>
    </div>
  );
}
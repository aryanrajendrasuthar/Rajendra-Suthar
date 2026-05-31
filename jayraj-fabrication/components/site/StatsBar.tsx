"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 16, suffix: "+", label: "Years of Excellence" },
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 80, suffix: "+", label: "Trusted Clients" },
  { value: 15, suffix: "+", label: "Cities Served" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 py-8 px-4">
      <div className="font-display text-5xl font-bold text-jf-lime">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/50 text-center">{label}</div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-jf-bg-section border-y border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

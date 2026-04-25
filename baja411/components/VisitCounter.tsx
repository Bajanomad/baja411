"use client";

import { useEffect, useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default function VisitCounter() {
  const [target, setTarget] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    fetch("/api/visits", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setTarget(typeof d.count === "number" ? d.count : null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (target === null) return;
    const start = Math.max(target - 60, 0);
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + (target - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  if (target === null) return null;

  return (
    <div className="mt-10 inline-block text-left select-none">
      {/* Live badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#2A7A5A" }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#2A7A5A" }} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#3D9970" }}>
          Live
        </span>
      </div>

      {/* Big number */}
      <div
        className="font-extrabold text-white tabular-nums leading-none"
        style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", textShadow: "0 0 40px rgba(42,122,90,0.4)" }}
      >
        {fmt(displayed)}
      </div>

      {/* Label */}
      <div className="text-white/45 text-sm mt-1.5 font-medium tracking-wide">
        Baja travelers &amp; counting
      </div>
    </div>
  );
}

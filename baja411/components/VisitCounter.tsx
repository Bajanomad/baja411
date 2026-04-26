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
    <div className="mt-4 inline-flex items-center gap-1.5 select-none">
      <span className="font-semibold text-white/70 tabular-nums text-sm leading-none">
        {fmt(displayed)}
      </span>
      <br></br>
      <span className="text-sunset text-xs">
  
        people using Baja 411
      </span>
    </div>
  );
}

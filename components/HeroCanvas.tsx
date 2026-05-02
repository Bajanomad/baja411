"use client";

import { useEffect, useRef } from "react";

interface Glint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glints = useRef<Glint[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = (w: number, h: number) => {
      if (glints.current.length > 80) return;
      if (Math.random() > 0.28) return;
      const life = 40 + Math.random() * 80;
      glints.current.push({
        x: Math.random() * w,
        y: h * 0.52 + Math.random() * h * 0.42, // water zone
        life,
        maxLife: life,
        size: Math.random() * 2.8 + 0.5,
      });
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      spawn(w, h);
      glints.current = glints.current.filter((g) => g.life > 0);

      glints.current.forEach((g) => {
        const alpha = Math.sin((g.life / g.maxLife) * Math.PI) * 0.9;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * (g.life / g.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,252,200,${alpha})`;
        ctx.shadowColor = "rgba(255,240,120,0.95)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        g.life--;
      });

      raf.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block", zIndex: 16 }}
    />
  );
}

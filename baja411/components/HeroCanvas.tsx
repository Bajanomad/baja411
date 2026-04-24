"use client";

import { useEffect, useRef } from "react";

interface Glint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  color: string;
  y: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const glints = useRef<Glint[]>([]);
  const waves = useRef<Wave[]>([]);
  const raf = useRef<number>(0);
  const tick = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      const h = canvas.height;

      // Vivid turquoise/teal beach wave layers
      waves.current = [
        {
          amplitude: 20,
          frequency: 0.0045,
          phase: 0,
          speed: 0.010,
          color: "rgba(8,80,105,0.90)",    // deep ocean base
          y: h * 0.66,
        },
        {
          amplitude: 15,
          frequency: 0.0070,
          phase: 1.6,
          speed: 0.016,
          color: "rgba(12,140,148,0.75)",  // teal
          y: h * 0.72,
        },
        {
          amplitude: 11,
          frequency: 0.0110,
          phase: 3.0,
          speed: 0.023,
          color: "rgba(20,175,165,0.65)",  // turquoise
          y: h * 0.78,
        },
        {
          amplitude: 7,
          frequency: 0.0160,
          phase: 0.7,
          speed: 0.030,
          color: "rgba(50,200,185,0.55)",  // bright aqua
          y: h * 0.83,
        },
        {
          amplitude: 4,
          frequency: 0.0230,
          phase: 4.5,
          speed: 0.038,
          color: "rgba(110,225,215,0.45)", // seafoam
          y: h * 0.88,
        },
      ];

      glints.current = [];
    };

    const spawnGlint = (w: number, h: number) => {
      if (glints.current.length > 100) return;
      if (Math.random() > 0.3) return;
      const life = 35 + Math.random() * 70;
      glints.current.push({
        x: Math.random() * w,
        y: h * 0.66 + Math.random() * h * 0.30,
        life,
        maxLife: life,
        size: Math.random() * 2.2 + 0.4,
      });
    };

    const drawWave = (wave: Wave) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 3) {
        const y =
          wave.y +
          Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.55 + wave.phase * 0.75) *
            wave.amplitude * 0.38;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
      wave.phase += wave.speed;
    };

    const draw = () => {
      tick.current++;
      const w = canvas.width;
      const h = canvas.height;

      // ── Sky: Baja golden-hour beach ───────────────────────────────────
      // Deep ocean blue at zenith → warm azure → golden orange → amber horizon
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.68);
      sky.addColorStop(0.00, "#1a3a60"); // deep blue zenith
      sky.addColorStop(0.18, "#2e72b0"); // vivid blue
      sky.addColorStop(0.42, "#c97828"); // warm orange breaks through
      sky.addColorStop(0.65, "#e8a020"); // rich golden
      sky.addColorStop(0.85, "#f7c84a"); // bright amber horizon
      sky.addColorStop(1.00, "#ffe08a"); // glowing gold at sea-meet
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.72);

      // ── Ocean base ────────────────────────────────────────────────────
      const sea = ctx.createLinearGradient(0, h * 0.62, 0, h);
      sea.addColorStop(0.0, "#0e6e82");
      sea.addColorStop(0.4, "#0a5468");
      sea.addColorStop(1.0, "#062e3e");
      ctx.fillStyle = sea;
      ctx.fillRect(0, h * 0.62, w, h * 0.38);

      // ── Sun glow (upper-right, partially off-screen) ──────────────────
      const sunX = w * 0.78;
      const sunY = h * 0.12;
      const sunR = Math.min(w, h) * 0.45;
      const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sun.addColorStop(0.00, "rgba(255,255,200,0.55)");
      sun.addColorStop(0.12, "rgba(255,220,80,0.30)");
      sun.addColorStop(0.35, "rgba(255,170,40,0.12)");
      sun.addColorStop(0.65, "rgba(255,130,20,0.05)");
      sun.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h * 0.65);

      // ── Horizon shimmer ───────────────────────────────────────────────
      const horizonY = h * 0.65;
      const hGrad = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 50);
      hGrad.addColorStop(0.00, "rgba(0,0,0,0)");
      hGrad.addColorStop(0.45, "rgba(255,210,80,0.28)");
      hGrad.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, horizonY - 30, w, 80);

      // ── Sun path on water (warm shimmering column) ────────────────────
      const pathX = w * 0.78;
      const pathGrad = ctx.createLinearGradient(pathX, h * 0.65, pathX, h);
      pathGrad.addColorStop(0.0, "rgba(255,220,80,0.22)");
      pathGrad.addColorStop(0.5, "rgba(255,180,40,0.10)");
      pathGrad.addColorStop(1.0, "rgba(0,0,0,0)");
      const pw = w * 0.22;
      ctx.fillStyle = pathGrad;
      ctx.fillRect(pathX - pw / 2, h * 0.65, pw, h * 0.35);

      // ── Ocean waves ───────────────────────────────────────────────────
      waves.current.forEach(drawWave);

      // ── Mouse warm glow ───────────────────────────────────────────────
      if (mouse.current.x > 0) {
        const mg = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 280
        );
        mg.addColorStop(0, "rgba(255,245,180,0.12)");
        mg.addColorStop(0.5, "rgba(255,210,80,0.05)");
        mg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Water sparkles (sunlight catching on crests) ──────────────────
      spawnGlint(w, h);
      glints.current = glints.current.filter((g) => g.life > 0);
      glints.current.forEach((g) => {
        const progress = g.life / g.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * progress, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,250,190,${alpha})`;
        ctx.shadowColor = "rgba(255,240,100,0.9)";
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
        g.life--;
      });

      // ── Left vignette (keeps hero text legible) ───────────────────────
      const vig = ctx.createLinearGradient(0, 0, w * 0.65, 0);
      vig.addColorStop(0.00, "rgba(8,20,40,0.62)");
      vig.addColorStop(0.45, "rgba(8,20,40,0.28)");
      vig.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

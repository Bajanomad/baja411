"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  warm: boolean; // gold vs teal bioluminescence
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
  const stars = useRef<Star[]>([]);
  const particles = useRef<Particle[]>([]);
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

      // Stars — upper 60%
      stars.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * h * 0.6,
        radius: Math.random() * 1.3 + 0.2,
        opacity: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.022 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Ocean waves — warm sunset palette
      waves.current = [
        {
          amplitude: 16,
          frequency: 0.0055,
          phase: 0,
          speed: 0.016,
          color: "rgba(200,90,30,0.18)", // deep sunset red
          y: h * 0.70,
        },
        {
          amplitude: 12,
          frequency: 0.008,
          phase: 1.8,
          speed: 0.022,
          color: "rgba(30,90,110,0.50)", // ocean teal
          y: h * 0.76,
        },
        {
          amplitude: 9,
          frequency: 0.012,
          phase: 3.2,
          speed: 0.028,
          color: "rgba(15,60,80,0.60)",
          y: h * 0.81,
        },
        {
          amplitude: 6,
          frequency: 0.016,
          phase: 0.5,
          speed: 0.034,
          color: "rgba(8,35,50,0.75)",
          y: h * 0.86,
        },
      ];

      particles.current = [];
    };

    const spawnParticle = (w: number, h: number) => {
      if (particles.current.length > 70) return;
      if (Math.random() > 0.2) return;
      const life = 90 + Math.random() * 130;
      const warm = Math.random() > 0.6; // 40% warm gold, 60% teal
      particles.current.push({
        x: Math.random() * w,
        y: h * 0.67 + Math.random() * h * 0.30,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.6 - 0.15,
        life,
        maxLife: life,
        radius: Math.random() * 2.8 + 0.4,
        warm,
      });
    };

    const drawWave = (wave: Wave) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 3) {
        const y =
          wave.y +
          Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.5 + wave.phase * 0.7) *
            wave.amplitude * 0.4;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cursor warm sunset glow
      if (mouse.current.x > 0) {
        const grd = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 340
        );
        grd.addColorStop(0, "rgba(255,160,60,0.10)");
        grd.addColorStop(0.5, "rgba(232,149,109,0.05)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Horizon golden glow
      const horizonY = canvas.height * 0.62;
      const hGrad = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 60);
      hGrad.addColorStop(0, "rgba(0,0,0,0)");
      hGrad.addColorStop(0.5, "rgba(220,120,40,0.09)");
      hGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, horizonY - 60, canvas.width, 120);

      // Twinkling stars
      stars.current.forEach((s) => {
        const t = tick.current * s.twinkleSpeed + s.twinkleOffset;
        const alpha = s.opacity * (0.55 + 0.45 * Math.sin(t));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Ocean waves
      waves.current.forEach(drawWave);

      // Bioluminescent + warm embers
      spawnParticle(canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life > 0);
      particles.current.forEach((p) => {
        const progress = p.life / p.maxLife;
        const alpha = progress * 0.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * progress, 0, Math.PI * 2);
        if (p.warm) {
          ctx.fillStyle = `rgba(255,180,80,${alpha * 0.8})`;
          ctx.shadowColor = "rgba(255,160,60,0.5)";
        } else {
          ctx.fillStyle = `rgba(80,220,190,${alpha})`;
          ctx.shadowColor = "rgba(60,200,170,0.55)";
        }
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });

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

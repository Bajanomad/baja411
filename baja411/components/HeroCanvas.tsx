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

      // Stars in top 65% of canvas
      stars.current = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * h * 0.65,
        radius: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Ocean waves in bottom 45%
      waves.current = [
        {
          amplitude: 14,
          frequency: 0.006,
          phase: 0,
          speed: 0.018,
          color: "rgba(30,90,100,0.55)",
          y: h * 0.72,
        },
        {
          amplitude: 10,
          frequency: 0.009,
          phase: 1.5,
          speed: 0.024,
          color: "rgba(20,70,85,0.45)",
          y: h * 0.78,
        },
        {
          amplitude: 7,
          frequency: 0.013,
          phase: 3.0,
          speed: 0.03,
          color: "rgba(42,122,90,0.25)",
          y: h * 0.83,
        },
      ];

      particles.current = [];
    };

    const spawnParticle = (w: number, h: number) => {
      if (particles.current.length > 60) return;
      if (Math.random() > 0.18) return;
      const life = 80 + Math.random() * 120;
      particles.current.push({
        x: Math.random() * w,
        y: h * 0.68 + Math.random() * h * 0.28,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.1,
        life,
        maxLife: life,
        radius: Math.random() * 2.5 + 0.5,
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
            wave.amplitude *
            0.4;
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

      // Cursor warm glow
      if (mouse.current.x > 0) {
        const grd = ctx.createRadialGradient(
          mouse.current.x,
          mouse.current.y,
          0,
          mouse.current.x,
          mouse.current.y,
          320
        );
        grd.addColorStop(0, "rgba(232,149,109,0.08)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Stars with twinkling
      stars.current.forEach((s) => {
        const t = tick.current * s.twinkleSpeed + s.twinkleOffset;
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(t));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Ocean waves
      waves.current.forEach(drawWave);

      // Bioluminescent particles
      spawnParticle(canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life > 0);
      particles.current.forEach((p) => {
        const progress = p.life / p.maxLife;
        const alpha = progress * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * progress, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,220,180,${alpha})`;
        ctx.shadowColor = "rgba(80,200,160,0.6)";
        ctx.shadowBlur = 6;
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

    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

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

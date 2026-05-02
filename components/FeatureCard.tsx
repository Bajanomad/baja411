"use client";

import Link from "next/link";
import { useRef } from "react";

interface FeatureCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  live?: boolean;
}

export default function FeatureCard({
  href,
  icon,
  title,
  description,
  badge,
  live,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.background = `radial-gradient(260px circle at ${x}px ${y}px, rgba(42,122,90,0.13), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col gap-4 p-6 bg-white rounded-2xl border border-black/[0.07] shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-jade/25 transition-all duration-300 overflow-hidden"
    >
      {/* Portal glow layer */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-all duration-200 pointer-events-none rounded-2xl"
      />

      {/* Badge */}
      {badge && (
        <span className="absolute top-4 right-4 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sunset-dim text-sunset z-10">
          {badge}
        </span>
      )}
      {live && (
        <span className="absolute top-4 right-4 flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-jade z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
          Live
        </span>
      )}

      {/* Icon */}
      <span className="text-3xl relative z-10">{icon}</span>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-jade transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>

      {/* Arrow */}
      <span className="relative z-10 mt-auto text-jade text-sm font-semibold translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        Explore →
      </span>
    </Link>
  );
}

"use client";

import { useEffect, useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  height?: string;
  strength?: number; // 0–1, how much the image shifts. default 0.25
  overlay?: string;  // CSS color/gradient for tint overlay
  children?: React.ReactNode;
}

export default function ParallaxImage({
  src,
  alt,
  height = "480px",
  strength = 0.25,
  overlay,
  children,
}: ParallaxImageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // progress: 0 when bottom enters viewport → 1 when top exits
      const progress =
        1 - rect.bottom / (viewH + rect.height);
      const shift = (progress - 0.5) * strength * rect.height;
      img.style.transform = `translateY(${shift}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [strength]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden w-full"
      style={{ height }}
    >
      {/* Parallax image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-x-0 w-full object-cover pointer-events-none select-none"
        style={{
          height: `${100 + strength * 100}%`,
          top: `-${(strength * 100) / 2}%`,
          willChange: "transform",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* Optional color overlay */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
        />
      )}

      {/* Content slot */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </section>
  );
}

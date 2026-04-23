"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/weather", label: "Weather" },
  { href: "/hurricane", label: "Hurricane" },
  { href: "/map", label: "Map" },
  { href: "/calendar", label: "Events" },
  { href: "/classifieds", label: "Classifieds" },
  { href: "/directory", label: "Directory" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-black/[0.06]"
          : "bg-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-bold text-lg tracking-tight transition-colors ${
            scrolled ? "text-jade" : "text-white"
          }`}
        >
          BAJA <span className="text-sunset">411</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-jade ${
                scrolled ? "text-foreground/70" : "text-white/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="#join"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-jade text-white hover:bg-jade-light transition-colors"
        >
          Join Free
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className={`md:hidden flex flex-col gap-[5px] p-2 ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          <span
            className={`block w-5 h-px bg-current transition-all duration-200 ${
              open ? "rotate-45 translate-y-[6px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-current transition-all duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-current transition-all duration-200 ${
              open ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/[0.06] shadow-lg py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-foreground/80 hover:text-jade hover:bg-jade-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-3 pb-1">
            <Link
              href="#join"
              onClick={() => setOpen(false)}
              className="block text-center w-full px-4 py-2.5 rounded-full text-sm font-semibold bg-jade text-white hover:bg-jade-light transition-colors"
            >
              Join Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

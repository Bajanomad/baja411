"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/weather", label: "Weather" },
  { href: "/hurricane", label: "Hurricane" },
  { href: "/map", label: "Map" },
  { href: "/calendar", label: "Events" },
  { href: "/classifieds", label: "Classifieds" },
  { href: "/directory", label: "Directory" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const alwaysSolid = pathname === "/map";
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside tap
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const solid = scrolled || alwaysSolid;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100001] transition-all duration-300 ${
        solid
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
            solid ? "text-jade" : "text-white"
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
                solid ? "text-foreground/70" : "text-white/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/signin"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-jade text-white hover:bg-jade-light transition-colors"
        >
          Sign In
        </Link>

        {/* Mobile hamburger */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={`flex flex-col gap-[5px] p-2 transition-colors ${
              solid ? "text-foreground" : "text-white"
            }`}
          >
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>

          {/* Glassy dropdown — floats from hamburger */}
          {open && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <div className="py-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-jade hover:bg-jade/5 ${
                      pathname === link.href ? "text-jade" : "text-foreground/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mx-3 mt-2 mb-1 pt-2 border-t border-black/[0.06]">
                  <Link
                    href="/signin"
                    onClick={() => setOpen(false)}
                    className="block text-center px-4 py-2 rounded-xl text-xs font-bold bg-jade text-white hover:bg-jade-light transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/map", label: "Map" },
  { href: "/weather", label: "Weather" },
  { href: "/news", label: "News" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);

    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    event.preventDefault();
    router.push("/");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100001] border-b border-white/[0.08] bg-night/85 text-white shadow-sm backdrop-blur-md"
      style={{ height: "var(--nav-height)" }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5">
        <Link href="/" onClick={handleLogoClick} className="text-lg font-extrabold tracking-tight text-white">
          BAJA <span className="text-sunset">411</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href ? "text-sunset" : "text-white/72 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/map"
          className="hidden rounded-full bg-jade px-4 py-2 text-sm font-extrabold text-white transition-colors hover:bg-jade-light md:inline-flex"
        >
          Open Map
        </Link>

        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] p-2 text-white"
          >
            <span className={`block h-px w-5 bg-current transition-transform duration-200 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-current transition-transform duration-200 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border shadow-xl"
              style={{
                background: "rgba(9,18,22,0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="py-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/[0.06] hover:text-white ${
                      pathname === link.href ? "text-sunset" : "text-white/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mx-3 mt-2 mb-1 border-t border-white/[0.08] pt-2">
                  <Link
                    href="/map"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-jade px-4 py-2 text-center text-xs font-extrabold text-white transition-colors hover:bg-jade-light"
                  >
                    Open Map
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

import Link from "next/link";

const explore = [
  { href: "/map", label: "Interactive Map" },
  { href: "/weather", label: "Weather" },
  { href: "/news", label: "Local News" },
  { href: "/calendar", label: "Events" },
];

const community = [
  { href: "/classifieds", label: "Classifieds" },
  { href: "/directory", label: "Business Directory" },
  { href: "/signin", label: "Sign In" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white/60">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(42,122,90,0.6) 30%, rgba(232,149,109,0.5) 70%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at top, rgba(42,122,90,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14">
        <div className="grid grid-cols-2 gap-10 border-b border-white/[0.07] pb-12 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                BAJA <span className="text-sunset">411</span>
              </span>
            </Link>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-white/50">
              Community driven local knowledge for Baja California Sur. Weather, maps, events, listings, and local resources in one place.
            </p>
            <p className="text-xs tracking-wide text-white/25">Cerritos · Pescadero · Todos Santos · La Paz · Cabo</p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Explore</p>
            <ul className="space-y-3">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Community</p>
            <ul className="space-y-3">
              {community.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-white/25 sm:flex-row">
          <p>Copyright {new Date().getFullYear()} Baja 411</p>
          <p>Made in La Paz, BCS, Mexico</p>
        </div>
      </div>
    </footer>
  );
}

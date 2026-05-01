import Link from "next/link";
import FooterAuthControl from "./FooterAuthControl";

const links = [
  { href: "/map", label: "Map" },
  { href: "/businesses", label: "Directory" },
  { href: "/weather", label: "Weather" },
  { href: "/rules-permits", label: "Rules" },
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

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12">
        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                BAJA <span className="text-sunset">411</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              Community-driven local knowledge for Baja California Sur. Maps, weather, news, local directory listings, and road intel in one clean place.
            </p>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-sunset/80">Curated locally. Updated often.</p>
            <p className="mt-3 text-xs tracking-wide text-white/25">Cerritos · Pescadero · Todos Santos · La Paz · Cabo</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-end">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-white/50 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
            <FooterAuthControl />
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-white/25 sm:flex-row">
          <p>© {new Date().getFullYear()} Baja 411</p>
          <p>Made in Baja Sur, México</p>
        </div>
      </div>
    </footer>
  );
}

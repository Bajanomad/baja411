import Link from "next/link";

const explore = [
  { href: "/map",       label: "Interactive Map" },
  { href: "/weather",   label: "Weather" },
  { href: "/hurricane", label: "Hurricane Tracker" },
  { href: "/news",      label: "Local News" },
  { href: "/calendar",  label: "Events" },
];

const community = [
  { href: "/classifieds", label: "Classifieds" },
  { href: "/directory",   label: "Business Directory" },
  { href: "/blog",        label: "Blog" },
  { href: "/signin",      label: "Sign In" },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white/60 relative overflow-hidden">

      {/* Top accent line */}
      <div className="h-px w-full" style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(42,122,90,0.6) 30%, rgba(232,149,109,0.5) 70%, transparent 100%)"
      }} />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{
        background: "radial-gradient(ellipse at top, rgba(42,122,90,0.06) 0%, transparent 70%)"
      }} />

      <div className="relative max-w-7xl mx-auto px-5 pt-14 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.07]">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-extrabold text-2xl text-white tracking-tight">
                BAJA <span className="text-sunset">411</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs mb-5">
              Community-driven local knowledge for Baja California Sur.
              Real spots, real info — from people who actually live here.
            </p>
            <p className="text-xs text-white/25 tracking-wide">
              Cerritos · Pescadero · Todos Santos · La Paz · Cabo
            </p>
          </div>

          {/* Explore links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 mb-5">
              Explore
            </p>
            <ul className="space-y-3">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 mb-5">
              Community
            </p>
            <ul className="space-y-3">
              {community.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} Baja 411 · Free forever · No ads, no paywalls.</p>
          <p>Made in La Paz, BCS, México</p>
        </div>
      </div>
    </footer>
  );
}

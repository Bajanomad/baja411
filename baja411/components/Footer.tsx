import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white/60">
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14">
        <Link href="/" className="mb-4 inline-block">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            BAJA <span className="text-sunset">411</span>
          </span>
        </Link>
        <p className="mb-4 max-w-xs text-sm leading-relaxed text-white/50">
          Community driven local knowledge for Baja California Sur. Weather, maps, events, listings, and local resources in one place.
        </p>
        <div className="pt-8 text-xs text-white/25">
          <p>Baja 411</p>
          <p>Made in La Paz, BCS, Mexico</p>
        </div>
      </div>
    </footer>
  );
}

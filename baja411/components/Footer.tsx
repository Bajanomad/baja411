import Link from "next/link";

const sections = [
  {
    title: "Explore",
    links: [
      { href: "/weather", label: "Weather" },
      { href: "/hurricane", label: "Hurricane Tracker" },
      { href: "/map", label: "Interactive Map" },
      { href: "/calendar", label: "Events Calendar" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/classifieds", label: "Classifieds" },
      { href: "/directory", label: "Business Directory" },
      { href: "/blog", label: "Blog & Lore" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white/70 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-bold text-xl text-white mb-2">
              BAJA <span className="text-sunset">411</span>
            </p>
            <p className="text-sm leading-relaxed max-w-xs">
              Your free guide to life in the Baja California Sur corridor.
              Community-driven. No paywalls. No ads.
            </p>
            <p className="mt-4 text-xs text-white/40">
              Cerritos · Pescadero · Todos Santos · La Paz · Cabo
            </p>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Baja 411. Free forever.</p>
          <p>Built with love in La Paz, BCS, México 🌊</p>
        </div>
      </div>
    </footer>
  );
}

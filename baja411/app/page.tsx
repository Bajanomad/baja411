import type { Metadata } from "next";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import HeroCanvas from "@/components/HeroCanvas";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Baja 411 — Your Guide to Life in Baja",
};

const features = [
  {
    href: "/weather",
    icon: "🌤️",
    title: "Weather",
    description: "Live forecasts, wind data, and radar for La Paz and the Baja corridor.",
    live: true,
  },
  {
    href: "/hurricane",
    icon: "🌀",
    title: "Hurricane Tracker",
    description: "Real-time NOAA satellite imagery and storm tracking for the Eastern Pacific.",
    live: true,
  },
  {
    href: "/map",
    icon: "🗺️",
    title: "Interactive Map",
    description: "Crowdsourced pins for boondocking, beaches, water fills, mechanics, and more.",
    badge: "Month 2",
  },
  {
    href: "/calendar",
    icon: "📅",
    title: "Events Calendar",
    description: "Local festivals, art walks, fiestas, and government holidays across the corridor.",
    badge: "Coming Soon",
  },
  {
    href: "/classifieds",
    icon: "🛒",
    title: "Classifieds",
    description: "Free buy, sell, and trade for vehicles, gear, housing, and services.",
    badge: "Coming Soon",
  },
  {
    href: "/directory",
    icon: "🏪",
    title: "Business Directory",
    description: "Restaurants, bars, mechanics, doctors, hotels — searchable by town and category.",
    badge: "Coming Soon",
  },
  {
    href: "/blog",
    icon: "📖",
    title: "Blog & Lore",
    description: "History, stories, and deep dives into the culture and landscape of Baja California.",
    badge: "Coming Soon",
  },
  {
    href: "#join",
    icon: "🌊",
    title: "Join the Community",
    description: "Sign up free to add map pins, post classifieds, and submit business listings.",
    badge: "Free",
  },
];

const pillars = [
  {
    icon: "🔓",
    title: "Free Forever",
    description:
      "No paywalls, no subscriptions, no nonsense. All core features stay free — always.",
  },
  {
    icon: "🤝",
    title: "Community Driven",
    description:
      "Built by locals and expats who live here. Your contributions make the site better for everyone.",
  },
  {
    icon: "🧭",
    title: "Local Knowledge",
    description:
      "Real, on-the-ground intel for travelers, expats, and the curious — not tourist brochure fluff.",
  },
];

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
        {/* Animated beach canvas */}
        <HeroCanvas />

        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Sunset horizon line */}
        <div
          className="horizon-glow absolute left-0 right-0 pointer-events-none"
          style={{
            top: "62%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(232,149,109,0.35) 30%, rgba(232,149,109,0.5) 50%, rgba(232,149,109,0.35) 70%, transparent)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-28 pb-24 w-full">
          <div className="max-w-3xl">
            <span className="label-tag mb-5 block">
              Cerritos · Pescadero · Todos Santos · La Paz · Cabo
            </span>

            <h1
              className="font-extrabold text-white leading-[1.04] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
            >
              Your Guide to
              <br />
              <span className="text-sunset">Life in Baja.</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Weather, hurricane tracking, boondocking maps, local events,
              classifieds, and a business directory — all free, all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-jade text-white font-semibold text-sm hover:bg-jade-light transition-colors shadow-lg shadow-jade/20"
              >
                Explore the Map
              </Link>
              <Link
                href="/directory"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-sunset/50 text-sunset font-semibold text-sm hover:bg-sunset-dim backdrop-blur-sm transition-colors"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </div>

        {/* Wave transition into content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <WaveDivider fill="#FAFAF7" />
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────── */}
      <section className="bg-sand pt-4 pb-20 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="label-tag mb-3 block">Everything you need</span>
            <h2
              className="font-bold text-foreground"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}
            >
              The Baja Corridor, covered.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature.href}
                className={`reveal reveal-delay-${Math.min(i % 4 + 1, 4)}`}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-5 relative overflow-hidden">
        {/* Decorative orbs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(42,122,90,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(232,149,109,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`text-center md:text-left reveal reveal-delay-${i + 1}`}
              >
                <span className="text-3xl mb-4 block">{pillar.icon}</span>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into CTA */}
      <WaveDivider fill="#060d18" />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        id="join"
        className="bg-night py-20 px-5 text-center relative overflow-hidden"
      >
        {/* Subtle wave texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(42,122,90,0.3) 41px)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto reveal">
          <span className="label-tag mb-4 block">Join the community</span>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}
          >
            Know a great spot?
            <br />
            Add it to the map.
          </h2>
          <p className="text-white/50 mb-8 text-base leading-relaxed">
            Sign up free and start contributing — boondocking spots, hidden
            beaches, reliable mechanics, the best taco stand on the corridor.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sunset text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-sunset/20"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import HeroCanvas from "@/components/HeroCanvas";
import HeroWaves from "@/components/HeroWaves";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "Baja 411 — Your Guide to Life in Baja",
};

// Unsplash photos chosen for Baja California Sur vibes
const PHOTOS = {
  // Turquoise bay / Sea of Cortez
  ocean:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&fit=crop&crop=center",
  // Golden hour on the Sea of Cortez — warm tones, no bad days
  golden:
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=80&fit=crop&crop=center",
  // Coastal town at sunset
  town:
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1800&q=80&fit=crop&crop=center",
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
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#04111c" }}>

        {/* ── Background photo ── */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=85&fit=crop&crop=center"
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.06)", transformOrigin: "center 55%" }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* ── Overlays ── */}
        {/* Left-side dark gradient keeps text readable */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(108deg, rgba(4,17,28,0.88) 0%, rgba(4,17,28,0.60) 38%, rgba(4,17,28,0.20) 65%, transparent 100%)"
        }} />
        {/* Bottom dark fade */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(180deg, transparent 45%, rgba(4,17,28,0.72) 100%)"
        }} />
        {/* Warm golden-hour tint — slowly breathes */}
        <div className="absolute inset-0 z-[1] hero-breathe" style={{
          background: "linear-gradient(180deg, rgba(210,110,20,0.20) 0%, rgba(240,165,30,0.10) 38%, transparent 68%)"
        }} />

        {/* ── Subtle dot grid texture ── */}
        <div className="absolute inset-0 z-[2] opacity-[0.018] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }} />

        {/* ── Horizon shimmer ── */}
        <div className="horizon-glow absolute left-0 right-0 pointer-events-none z-[3]" style={{
          top: "58%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,210,80,0.25) 30%, rgba(255,225,80,0.40) 50%, rgba(255,210,80,0.25) 70%, transparent)",
        }} />

        {/* ── Sun sparkles on water (canvas) ── */}
        <HeroCanvas />

        {/* ── Animated ocean waves ── */}
        <HeroWaves />

        <div className="relative z-[20] max-w-7xl mx-auto px-5 pt-28 pb-24 w-full">
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

        <div className="absolute bottom-0 left-0 right-0 z-[30]">
          <WaveDivider fill="#FAFAF7" />
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────── */}
      <section className="bg-sand pt-4 pb-16 px-5">
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
                className={`reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parallax 1: Sea of Cortez ─────────────────────────────────── */}
      <ParallaxImage
        src={PHOTOS.ocean}
        alt="Turquoise waters of the Sea of Cortez, Baja California Sur"
        height="520px"
        strength={0.3}
        overlay="linear-gradient(180deg, rgba(6,13,24,0.35) 0%, rgba(13,48,64,0.2) 50%, rgba(6,13,24,0.5) 100%)"
      >
        <div className="text-center px-5 reveal">
          <p
            className="font-extrabold text-white leading-tight drop-shadow-lg"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
          >
            The Sea of Cortez.
          </p>
          <p className="text-white/75 mt-3 text-lg drop-shadow">
            Jacques Cousteau called it{" "}
            <em>&ldquo;the world&apos;s aquarium.&rdquo;</em>
          </p>
        </div>
      </ParallaxImage>

      {/* ── Pillars ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-5 relative overflow-hidden">
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

      {/* ── Parallax 2: Baja Desert ───────────────────────────────────── */}
      <ParallaxImage
        src={PHOTOS.golden}
        alt="Golden hour sunset over the Sea of Cortez, Baja California Sur"
        height="460px"
        strength={0.28}
        overlay="linear-gradient(180deg, rgba(6,13,24,0.1) 0%, rgba(80,30,10,0.35) 60%, rgba(6,13,24,0.55) 100%)"
      >
        <div className="text-center px-5 reveal">
          <p
            className="font-extrabold text-white leading-tight drop-shadow-lg"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
          >
            No Bad Days.
          </p>
          <p className="text-white/75 mt-3 text-lg drop-shadow">
            Golden hour on the Sea of Cortez.
          </p>
        </div>
      </ParallaxImage>

      {/* ── Events & News ────────────────────────────────────────────── */}
      <ParallaxImage
        src={PHOTOS.town}
        alt="Vibrant community life along the Baja California corridor"
        height="460px"
        strength={0.25}
        overlay="linear-gradient(180deg, rgba(4,12,24,0.70) 0%, rgba(4,12,24,0.50) 50%, rgba(4,12,24,0.78) 100%)"
      >
        <div className="text-center px-5 w-full max-w-3xl mx-auto reveal">
          <span className="label-tag mb-3 block">Stay in the loop</span>
          <h2
            className="font-bold text-white mb-8 drop-shadow-lg"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}
          >
            Events &amp; News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {[
              {
                href: "/calendar",
                icon: "📅",
                title: "Events Calendar",
                desc: "Festivals, art walks, fiestas, and government holidays across the corridor.",
                badge: "Coming Soon",
              },
              {
                href: "/news",
                icon: "📰",
                title: "Local News",
                desc: "Headlines from Mexico News Daily, the Gringo Gazette, and The Baja Nomad.",
                live: true,
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left hover:-translate-y-1 hover:bg-white/15 transition-all duration-200"
              >
                <span className="text-3xl mb-4 block">{card.icon}</span>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-sunset transition-colors">
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{card.desc}</p>
                {card.live && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-jade/30 text-jade text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse inline-block" />
                    Live
                  </span>
                )}
                {card.badge && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-white/55 text-xs font-medium">
                    {card.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </ParallaxImage>

      {/* ── Parallax 3: Ocean ─────────────────────────────────────────── */}
      <ParallaxImage
        src={PHOTOS.ocean}
        alt="Turquoise waters of the Sea of Cortez stretching to the horizon"
        height="400px"
        strength={0.25}
        overlay="linear-gradient(180deg, rgba(6,13,24,0.15) 0%, rgba(6,13,24,0.55) 100%)"
      >
        <div className="text-center px-5 reveal">
          <p
            className="font-extrabold text-white leading-tight drop-shadow-lg"
            style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)" }}
          >
            Your community awaits.
          </p>
          <Link
            href="#join"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-colors"
          >
            Join Baja 411 — Free
          </Link>
        </div>
      </ParallaxImage>

      {/* Wave into CTA */}
      <WaveDivider fill="#060d18" />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        id="join"
        className="bg-night py-20 px-5 text-center relative overflow-hidden"
      >
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

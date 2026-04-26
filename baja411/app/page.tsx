import type { Metadata } from "next";
import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";
import HeroWaves from "@/components/HeroWaves";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import HomeWeatherStrip from "@/components/HomeWeatherStrip";

// Final no-op deploy retry after Vercel build rate limit.

export const metadata: Metadata = {
  title: "Baja 411 | Live Local Intel for Baja Sur",
  description:
    "Baja 411 is a clean map first tool for driving, planning, weather, storms, local news, and practical Baja road intel.",
};

const driveTools = [
  { icon: "◎", title: "Auto GPS", body: "Opens on your location and keeps the map centered while you move." },
  { icon: "⛽", title: "Road stops", body: "Fuel, water, mechanics, markets, beaches, and useful places from the map." },
  { icon: "🧭", title: "Recenter fast", body: "Drift around the map, then snap right back to yourself with one tap." },
  { icon: "🛣️", title: "Less clutter", body: "Drive Mode keeps tools off the screen so the road stays front and center." },
];

const planTools = [
  { icon: "🔎", title: "Search towns", body: "Jump to places like Pescadero, Cerritos, La Paz, Cabo, and more." },
  { icon: "☰", title: "Filter pins", body: "Show only what matters: fuel, water, mechanics, beaches, camping, markets." },
  { icon: "+", title: "Add spots", body: "When sign in is restored, add useful pins for other Baja travelers." },
];

function DarkTile({ item }: { item: (typeof driveTools)[number] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white shadow-sm">
      <span className="text-3xl">{item.icon}</span>
      <h3 className="mt-4 text-base font-extrabold">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
    </div>
  );
}

function LightTile({ item }: { item: (typeof planTools)[number] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <span className="text-3xl">{item.icon}</span>
      <h3 className="mt-4 text-base font-extrabold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      <section className="relative min-h-[100svh] overflow-hidden bg-night">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2200&q=85&fit=crop&crop=center"
            alt="Baja coastline"
            className="h-full w-full object-cover"
            style={{ transform: "scale(1.05)", transformOrigin: "center 55%" }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(110deg, rgba(4,17,28,0.94) 0%, rgba(4,17,28,0.76) 42%, rgba(4,17,28,0.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[1] hero-breathe"
          style={{
            background:
              "linear-gradient(180deg, rgba(232,149,109,0.18) 0%, rgba(42,122,90,0.10) 44%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 z-[2] opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />

        <HeroCanvas />
        <HeroWaves />

        <div className="relative z-[20] mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-5 pb-28 pt-24 sm:pb-24 sm:pt-28">
          <div className="max-w-3xl -translate-y-2 sm:translate-y-0">
            <span className="label-tag mb-4 block sm:mb-5">Baja California Sur</span>
            <h1
              className="font-extrabold leading-[1.02] text-white"
              style={{ fontSize: "clamp(2.9rem, 7vw, 6.3rem)" }}
            >
              Live local intel.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
              Baja411 is a map first tool for driving Baja, planning stops, checking useful places, and finding the road intel people actually need out here.
            </p>

            <div className="mt-7 grid w-full max-w-xl grid-cols-2 gap-3 sm:mt-8 sm:mx-0">
              <Link
                href="/map"
                className="inline-flex min-h-16 items-center justify-center rounded-full bg-jade px-5 py-4 text-center text-base font-extrabold text-white shadow-xl shadow-jade/25 transition hover:bg-jade-light sm:px-8"
              >
                Open Map
              </Link>
              <Link
                href="/weather"
                className="inline-flex min-h-16 items-center justify-center rounded-full border border-white/22 bg-white/10 px-5 py-4 text-center text-base font-extrabold text-white shadow-xl backdrop-blur transition hover:bg-white/15 sm:px-8"
              >
                Weather
              </Link>
            </div>

            <HomeWeatherStrip />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[30]">
          <WaveDivider fill="#060d18" />
        </div>
      </section>

      <section className="bg-night px-5 pb-18 pt-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="reveal">
            <span className="label-tag mb-3 block">Drive mode</span>
            <h2 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Built for the road, not for clicking around like a lost tourist.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              Drive Mode keeps the map clean. It starts with your location, tracks while you move, and keeps planning tools out of your face until you actually need them.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {driveTools.map((item) => (
              <DarkTile key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="reveal">
            <span className="label-tag mb-3 block">Plan mode</span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Park first. Then search, pin, filter, and plan.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Plan Mode is for when you are stopped or mapping out the next leg. Search towns, filter useful spots, and decide where you are going before you start rolling again.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {planTools.map((item) => (
              <LightTile key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

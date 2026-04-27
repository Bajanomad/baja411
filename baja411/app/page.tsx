import type { Metadata } from "next";
import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";
import HeroWaves from "@/components/HeroWaves";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import HomeWeatherStrip from "@/components/HomeWeatherStrip";

// Deploy retry after Vercel build rate limit reset.

export const metadata: Metadata = {
  title: "Baja 411 | Baja Road Intel Before You Roll",
  description:
    "Baja 411 helps travelers drive and plan through Baja California Sur with map first local intel, weather, road stops, fuel, alerts, and practical trusted information.",
};

const driveHref = "/map?mode=drive";
const planHref = "/map?mode=plan";

const quickTools = [
  { icon: "⛽", title: "Fuel", body: "Find useful stops before the tank starts talking dirty." },
  { icon: "💧", title: "Water", body: "Spot fills, markets, and practical supply stops." },
  { icon: "🔧", title: "Mechanics", body: "Repair help when Baja decides to test your suspension." },
  { icon: "🏕️", title: "Camping", body: "Beaches, boondocking, and overnight options." },
  { icon: "🛒", title: "Groceries", body: "Markets and essentials near the route." },
  { icon: "🏖️", title: "Beaches", body: "Good stops, views, and places worth the detour." },
  { icon: "🏥", title: "Health", body: "Clinics, pharmacies, and emergency basics." },
  { icon: "📡", title: "Signal", body: "Local notes for dead zones and useful coverage." },
];

const driveCards = [
  { title: "Location first", body: "Open the map, center on yourself, and keep the road view clean." },
  { title: "Useful stops", body: "Fuel, water, mechanics, markets, beaches, and local resources stay easy to reach." },
  { title: "Less screen junk", body: "Drive Mode should keep tools out of your face until you actually need them." },
];

const planCards = [
  { title: "Search towns", body: "Plan around Todos Santos, Pescadero, Cerritos, La Paz, Cabo, and everything in between." },
  { title: "Filter by need", body: "Find the category you care about instead of doom scrolling through map pins." },
  { title: "Check before signal drops", body: "Use the weather, storm links, and local notes before rolling into weak coverage." },
];

const trustCards = [
  { title: "Curated locally", body: "Built from Baja Sur instead of scraped from some dead travel list nobody checked since forever." },
  { title: "Updated often", body: "The whole point is living road intel, corrections, useful reports, and current local context." },
  { title: "Community powered", body: "Travelers and locals can send corrections, missing places, and practical updates." },
];

function UtilityCard({ item }: { item: (typeof quickTools)[number] }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.055] p-4 text-white shadow-sm backdrop-blur sm:p-5">
      <div className="text-2xl">{item.icon}</div>
      <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">{item.title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-white/50 sm:text-sm">{item.body}</p>
    </div>
  );
}

function FeatureCard({ item }: { item: (typeof driveCards)[number] }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-base font-extrabold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
    </div>
  );
}

function TrustCard({ item }: { item: (typeof trustCards)[number] }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-night/55 p-5 text-white shadow-sm">
      <h3 className="text-base font-extrabold">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/52">{item.body}</p>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/36">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-white/80">{value}</p>
    </div>
  );
}

function PhoneMapPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] lg:mr-0">
      <div className="absolute -inset-8 rounded-full bg-jade/20 blur-3xl" />
      <div className="relative rounded-[2.5rem] border border-white/14 bg-black/35 p-3 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#10221f]">
          <div className="flex items-center justify-between border-b border-white/10 bg-night/88 px-4 py-3 text-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sunset">Drive Mode</p>
              <p className="text-sm font-extrabold">Baja 411 Map</p>
            </div>
            <div className="rounded-full bg-jade px-3 py-1 text-[10px] font-extrabold">GPS</div>
          </div>

          <div
            className="relative h-[25rem]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(232,149,109,0.24) 0 2px, transparent 3px), radial-gradient(circle at 72% 48%, rgba(42,122,90,0.5) 0 4px, transparent 5px), radial-gradient(circle at 45% 72%, rgba(255,255,255,0.42) 0 3px, transparent 4px), linear-gradient(140deg, rgba(250,250,247,0.08) 0 12%, transparent 12% 100%), linear-gradient(25deg, transparent 0 45%, rgba(232,149,109,0.28) 46% 48%, transparent 49% 100%), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px",
            }}
          >
            <div className="absolute left-5 top-5 rounded-2xl border border-white/12 bg-night/82 px-4 py-3 text-white shadow-xl backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Nearby</p>
              <p className="mt-1 text-sm font-extrabold">Fuel · 8 min</p>
            </div>

            <div className="absolute right-5 top-28 rounded-2xl border border-white/12 bg-night/82 px-4 py-3 text-white shadow-xl backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Weather</p>
              <p className="mt-1 text-sm font-extrabold">Wind 9 kt</p>
            </div>

            <div className="absolute bottom-24 left-6 rounded-2xl border border-white/12 bg-night/82 px-4 py-3 text-white shadow-xl backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Local note</p>
              <p className="mt-1 text-sm font-extrabold">Road stop verified</p>
            </div>

            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-2">
              <Link href={driveHref} className="rounded-2xl bg-jade px-4 py-3 text-center text-xs font-extrabold text-white">
                Drive
              </Link>
              <Link href={planHref} className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-center text-xs font-extrabold text-white">
                Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
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
              "linear-gradient(110deg, rgba(4,17,28,0.96) 0%, rgba(4,17,28,0.82) 44%, rgba(4,17,28,0.42) 100%)",
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

        <div className="relative z-[20] mx-auto grid min-h-[100svh] w-full max-w-7xl items-center gap-12 px-5 pb-32 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left">
            <span className="label-tag mb-4 block sm:mb-5">Curated locally · Updated often</span>
            <h1
              className="font-extrabold leading-[0.98] text-white"
              style={{ fontSize: "clamp(3rem, 7vw, 6.4rem)" }}
            >
              Baja road intel before you roll.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/66 md:text-lg lg:mx-0">
              Fuel, weather, road stops, local updates, and trusted Baja Sur info built for travelers moving through the peninsula.
            </p>

            <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 sm:mt-8 lg:mx-0">
              <Link
                href={driveHref}
                className="inline-flex min-h-16 items-center justify-center rounded-full bg-jade px-5 py-4 text-center text-base font-extrabold text-white shadow-xl shadow-jade/25 transition hover:bg-jade-light sm:px-8"
              >
                Drive Mode
              </Link>
              <Link
                href={planHref}
                className="inline-flex min-h-16 items-center justify-center rounded-full border border-white/22 bg-white/10 px-5 py-4 text-center text-base font-extrabold text-white shadow-xl backdrop-blur transition hover:bg-white/15 sm:px-8"
              >
                Plan Trip
              </Link>
            </div>

            <p className="mx-auto mt-3 max-w-xl text-xs font-semibold text-white/38 lg:mx-0">
              Built for phones on the road and laptops before the drive.
            </p>

            <div className="mx-auto mt-6 max-w-xl rounded-[2rem] border border-white/12 bg-white/[0.075] p-4 text-left shadow-2xl shadow-black/15 backdrop-blur-md lg:mx-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">Today in Baja Sur</p>
                  <p className="mt-1 text-base font-extrabold text-white">Live travel status</p>
                </div>
                <Link href="/weather" className="shrink-0 rounded-full border border-white/14 px-3 py-2 text-xs font-extrabold text-white/72 transition hover:bg-white/10 hover:text-white">
                  Weather
                </Link>
              </div>

              <HomeWeatherStrip />

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <StatusPill label="Storm check" value="Weather page" />
                <StatusPill label="Road notes" value="Map pins" />
                <StatusPill label="Updates" value="Local fixes" />
              </div>
            </div>
          </div>

          <PhoneMapPreview />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[30]">
          <WaveDivider fill="#060d18" />
        </div>
      </section>

      <section className="bg-night px-5 pb-18 pt-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mx-auto max-w-3xl text-center">
            <span className="label-tag mb-3 block">Find it fast</span>
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              The stuff travelers actually need, not a tourism brochure in a cowboy hat.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
              The landing page gets people into the map fast, then proves the app knows what matters on the road.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {quickTools.map((item) => (
              <UtilityCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="plan-trip" className="bg-white px-5 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="reveal rounded-[2rem] border border-border bg-sand p-6 shadow-sm sm:p-8">
            <span className="label-tag mb-3 block">When you are driving</span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Open the map. See what matters. Keep moving.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              Drive Mode is for the one hand, low patience, bad signal situation. Location, nearby stops, and clean controls need to stay obvious.
            </p>
            <div className="mt-6 grid gap-3">
              {driveCards.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
            <Link href={driveHref} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-jade px-6 py-4 text-center text-sm font-extrabold text-white transition hover:bg-jade-light sm:w-auto">
              Start Drive Mode
            </Link>
          </div>

          <div className="reveal rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
            <span className="label-tag mb-3 block">When you are parked</span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Plan the next leg before Baja eats your signal.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              Plan Trip is for coffee, shade, laptop mode, or sitting in the van figuring out where tomorrow starts.
            </p>
            <div className="mt-6 grid gap-3">
              {planCards.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
            <Link href={planHref} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full border border-border bg-foreground px-6 py-4 text-center text-sm font-extrabold text-white transition hover:bg-black sm:w-auto">
              Plan With Map
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-night px-5 py-18 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="reveal">
            <span className="label-tag mb-3 block">Local trust</span>
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Local info beats random reviews and stale travel blogs.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              Baja 411 should feel alive. Not another map full of mystery pins, broken listings, and old advice from somebody who passed through once in 2016.
            </p>
            <a
              href="mailto:BajaNomad@gmail.com?subject=Baja%20411%20feedback"
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white px-6 py-4 text-center text-sm font-extrabold text-night transition hover:bg-sand sm:w-auto"
            >
              Send a correction
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trustCards.map((item) => (
              <TrustCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[100000] border-t border-white/10 bg-night/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <Link href={driveHref} className="rounded-full bg-jade px-4 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-jade/20">
            Drive Mode
          </Link>
          <Link href={planHref} className="rounded-full border border-white/14 bg-white/10 px-4 py-3 text-center text-sm font-extrabold text-white">
            Plan Trip
          </Link>
        </div>
      </div>
    </>
  );
}

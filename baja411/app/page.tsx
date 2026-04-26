import type { Metadata } from "next";
import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";
import HeroWaves from "@/components/HeroWaves";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Baja 411 | Live Local Intel for Baja Sur",
  description:
    "Baja 411 gives travelers, locals, and expats fast access to maps, weather, hurricane tracking, local news, and Baja road intel.",
};

const quickActions = [
  {
    href: "/map",
    label: "Drive mode",
    title: "Open the map",
    description: "GPS first. Track your position, find useful spots, and get directions fast.",
    icon: "◎",
    tone: "bg-jade text-white border-jade",
  },
  {
    href: "/weather",
    label: "Live weather",
    title: "Check conditions",
    description: "Wind, rain, temperature, and forecast tools for Baja Sur.",
    icon: "🌤️",
    tone: "bg-white text-foreground border-white/70",
  },
  {
    href: "/hurricane",
    label: "Storm watch",
    title: "Track hurricanes",
    description: "NOAA satellite views and Eastern Pacific storm tracking.",
    icon: "🌀",
    tone: "bg-white text-foreground border-white/70",
  },
];

const todayItems = [
  { href: "/weather", icon: "🌡️", title: "Weather", body: "Quick forecast and wind tools." },
  { href: "/hurricane", icon: "🌀", title: "Storms", body: "Hurricane tracker and satellite views." },
  { href: "/news", icon: "📰", title: "News", body: "Local headlines from Baja sources." },
  { href: "/calendar", icon: "📅", title: "Events", body: "Festivals, markets, closures, and local dates." },
];

const roadTools = [
  { icon: "⛽", title: "Fuel", body: "Find fuel stops from the map." },
  { icon: "🔧", title: "Mechanics", body: "Useful when the road punches back." },
  { icon: "💧", title: "Water", body: "Water fills and practical road resources." },
  { icon: "🏕️", title: "Camp", body: "Boondocking and overnight spots." },
];

const planTools = [
  { href: "/map", icon: "🗺️", title: "Plan a route", body: "Switch to Plan Mode and search for stops before you roll." },
  { href: "/directory", icon: "🏪", title: "Directory", body: "Businesses, services, food, hotels, and local help. Coming next." },
  { href: "/classifieds", icon: "🛒", title: "Classifieds", body: "Vehicles, rentals, gear, and local services. Coming next." },
];

function ActionCard({ action }: { action: (typeof quickActions)[number] }) {
  return (
    <Link
      href={action.href}
      className={`group rounded-3xl border p-5 shadow-2xl transition-transform hover:-translate-y-1 ${action.tone}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-70">
            {action.label}
          </p>
          <h2 className="mt-2 text-xl font-extrabold leading-tight">{action.title}</h2>
        </div>
        <span className="text-3xl leading-none">{action.icon}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed opacity-75">{action.description}</p>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] opacity-80">
        Open
      </p>
    </Link>
  );
}

function SmallLinkCard({ item }: { item: (typeof todayItems)[number] }) {
  return (
    <Link
      href={item.href}
      className="rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-2xl">{item.icon}</span>
      <h3 className="mt-3 text-sm font-extrabold text-foreground">{item.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
    </Link>
  );
}

function RoadCard({ item }: { item: (typeof roadTools)[number] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white shadow-sm">
      <span className="text-2xl">{item.icon}</span>
      <h3 className="mt-3 text-sm font-extrabold">{item.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-white/55">{item.body}</p>
    </div>
  );
}

function PlanCard({ item }: { item: (typeof planTools)[number] }) {
  return (
    <Link
      href={item.href}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="text-3xl">{item.icon}</span>
      <h3 className="mt-4 text-lg font-extrabold text-foreground">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      <section className="relative min-h-screen overflow-hidden bg-night">
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

        <div className="relative z-[20] mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-24 pt-28">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="label-tag mb-5 block">Baja California Sur</span>
              <h1
                className="font-extrabold leading-[1.02] text-white"
                style={{ fontSize: "clamp(2.8rem, 7vw, 6.3rem)" }}
              >
                Live local intel for Baja.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
                A clean map first tool for driving, planning, weather, storms, local news, and the spots people actually use on the road.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/map"
                  className="inline-flex items-center justify-center rounded-full bg-jade px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-jade/25 transition hover:bg-jade-light"
                >
                  Open Baja411 Map
                </Link>
                <Link
                  href="/weather"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Check Weather
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {quickActions.map((action) => (
                <ActionCard key={action.href} action={action} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[30]">
          <WaveDivider fill="#FAFAF7" />
        </div>
      </section>

      <section className="bg-sand px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="label-tag mb-2 block">Today in Baja</span>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
                Open once. Know what matters.
              </h2>
            </div>
            <Link href="/news" className="text-sm font-extrabold text-jade hover:underline">
              Read local headlines
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {todayItems.map((item) => (
              <SmallLinkCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="label-tag mb-3 block">Drive mode</span>
            <h2 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Built for the road, not for clicking around like a lost tourist.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              Drive Mode keeps the map clean. GPS tracking, recenter, and the road in front of you. Planning tools stay out of the way until you switch modes.
            </p>
            <Link
              href="/map"
              className="mt-7 inline-flex rounded-full bg-sunset px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-sunset/20 transition hover:opacity-90"
            >
              Start Driving
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {roadTools.map((item) => (
              <RoadCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 max-w-2xl">
            <span className="label-tag mb-3 block">Plan mode</span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Park first. Then search, pin, filter, and plan.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              Plan Mode is where the useful mess lives. Search spots, filter categories, add pins, and build the next stretch before you start moving again.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {planTools.map((item) => (
              <PlanCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sand px-5 py-16">
        <div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(42,122,90,0.10) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,149,109,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="label-tag mb-3 block">Next up</span>
          <h2 className="text-3xl font-extrabold text-foreground md:text-5xl">
            Nearby, directory, classifieds, and better pin trust.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
            The core app is the map. The next layer is making nearby fuel, water, mechanics, services, and community updates stupid easy to find.
          </p>
          <Link
            href="/map"
            className="mt-8 inline-flex rounded-full bg-jade px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-jade/20 transition hover:bg-jade-light"
          >
            Go to Map
          </Link>
        </div>
      </section>
    </>
  );
}

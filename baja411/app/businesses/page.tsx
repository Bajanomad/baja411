import type { Metadata } from "next";
import Link from "next/link";
import { businesses, businessCategories, businessTowns } from "@/data/businesses";

export const metadata: Metadata = {
  title: "Local Businesses",
  description:
    "Find useful businesses and local services across Baja Sur including food, fuel, mechanics, medical help, rentals, supplies, and more.",
};

const quickNeeds = [
  { title: "Food", body: "Tacos, coffee, restaurants, bakeries, and quick stops." },
  { title: "Road help", body: "Fuel, tire shops, mechanics, batteries, water, and propane." },
  { title: "Daily life", body: "Groceries, hardware, pharmacies, dentists, vets, and services." },
  { title: "Plan ahead", body: "Rentals, tours, real estate, stays, and useful local contacts." },
];

const stats = [
  { value: "Search", label: "by need, town, or category" },
  { value: "Act", label: "call, message, directions" },
  { value: "Map", label: "pin links coming next" },
];

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="relative overflow-hidden bg-night px-5 pb-14 pt-28 text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(232,149,109,0.35), transparent 32%), radial-gradient(circle at 80% 10%, rgba(42,122,90,0.35), transparent 30%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="label-tag mb-4 block">Local directory</span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.02] md:text-6xl">
              Find what you need in Baja without digging through internet garbage.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              Food, fuel, mechanics, supplies, rentals, medical help, and local services across Cerritos, El Pescadero, Todos Santos, La Paz, Cabo, and the Baja corridor.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.value} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-lg font-extrabold text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#directory" className="inline-flex min-h-14 items-center justify-center rounded-full bg-jade px-7 py-3 text-sm font-extrabold text-white shadow-xl shadow-jade/25 transition hover:bg-jade-light">
                Search Businesses
              </a>
              <Link href="/map" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15">
                Open Map
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
            <div className="rounded-3xl bg-white p-5 text-foreground">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sunset">Quick find</p>
              <div className="mt-4 rounded-2xl border border-border bg-sand px-4 py-4 text-sm font-semibold text-muted">
                Search mechanic, propane, coffee, dentist...
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {quickNeeds.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-extrabold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <span className="label-tag mb-3 block">Why it helps</span>
              <h2 className="text-xl font-extrabold text-foreground">Useful stuff first.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                This directory is built around real needs: eat, fix the car, find fuel, get medicine, refill water, book a place, or contact someone local.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <span className="label-tag mb-3 block">How it works</span>
              <h2 className="text-xl font-extrabold text-foreground">Search now. Map later.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Listings start as searchable cards. Next, approved businesses can connect to Baja 411 map pins for direct map guidance.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <span className="label-tag mb-3 block">Community data</span>
              <h2 className="text-xl font-extrabold text-foreground">Bad info gets cleaned up.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The backbone is set up for verified listings, suggested edits, reports, and admin review so stale junk does not rot the directory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="px-5 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="label-tag mb-2 block">Browse</span>
              <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">Business Directory</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                This first version is the landing-page backbone. Search and filters are visually staged here so the real filtering, database, and map-pin links can plug in cleanly next.
              </p>
            </div>
            <button className="rounded-full bg-sunset px-6 py-3 text-sm font-extrabold text-white shadow-sm">
              Suggest a Business
            </button>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-4 shadow-sm md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <input
                placeholder="Search tacos, mechanic, propane, dentist, rentals..."
                className="w-full rounded-2xl border border-border bg-sand px-5 py-4 text-sm font-semibold text-foreground shadow-sm focus:outline-none"
              />
              <button className="rounded-2xl bg-jade px-7 py-4 text-sm font-extrabold text-white transition hover:bg-jade-light">
                Search
              </button>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">Categories</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {businessCategories.map((cat) => (
                  <div key={cat} className="whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-foreground shadow-sm">
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">Towns</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {businessTowns.map((town) => (
                  <div key={town} className="whitespace-nowrap rounded-full border border-border bg-sand px-4 py-2 text-xs font-bold text-foreground">
                    {town}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {businesses.map((business) => (
              <article key={business.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-sunset">{business.category}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-foreground">{business.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">{business.town}{business.area ? ` · ${business.area}` : ""}</p>
                  </div>
                  <span className="rounded-full bg-sand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
                    {business.mapPinId ? "Mapped" : "Map soon"}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{business.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {business.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-jade-dim px-3 py-1 text-[11px] font-bold text-jade">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-full bg-jade px-4 py-2 text-xs font-extrabold text-white">
                    Call
                  </button>
                  <button className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-foreground">
                    Directions
                  </button>
                  <button className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-muted">
                    {business.mapPinId ? "View on Map" : "Map Pin Coming Soon"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

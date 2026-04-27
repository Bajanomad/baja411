import type { Metadata } from "next";
import Link from "next/link";
import { getDirectoryBusinesses } from "@/lib/business-directory";
import { businessCategories, businessTowns } from "@/data/businesses";

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

export default async function BusinessesPage() {
  const businesses = await getDirectoryBusinesses();

  return (
    <div className="min-h-screen bg-sand">
      <section className="relative overflow-hidden bg-night px-5 pb-14 pt-28 text-white">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="label-tag mb-4 block">Local directory</span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.02] md:text-6xl">
              Find what you need in Baja without digging through internet garbage.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              Food, fuel, mechanics, supplies, rentals, medical help, and local services across the Baja corridor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#directory" className="inline-flex min-h-14 items-center justify-center rounded-full bg-jade px-7 py-3 text-sm font-extrabold text-white">
                Search Businesses
              </a>
              <Link href="/map" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-extrabold text-white">
                Open Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-foreground">Business Directory</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {businesses.map((business) => (
              <article key={business.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-sunset">{business.category}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-foreground">{business.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">{business.town}</p>
                  </div>
                  <span className="text-xs text-muted">
                    {business.mapPinId ? "Mapped" : "Map soon"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-muted">{business.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-full bg-jade px-4 py-2 text-xs font-extrabold text-white">
                    Call
                  </button>
                  <button className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-foreground">
                    Directions
                  </button>
                  <button className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-muted">
                    View Map
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

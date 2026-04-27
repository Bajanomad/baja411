import type { Metadata } from "next";
import { businesses, businessCategories } from "@/data/businesses";

export const metadata: Metadata = {
  title: "Local Businesses",
  description: "Search useful businesses across Baja Sur including food, fuel, mechanics, medical, rentals, and services.",
};

export default function BusinessesPage() {
  return (
    <div className="px-5 pt-24 pb-16 bg-sand min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="label-tag mb-2 block">Directory</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Find Local Businesses in Baja Sur
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-muted">
            Need food, fuel, repairs, supplies, rentals, or medical help? Search useful businesses across the Baja corridor.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            placeholder="Search tacos, mechanic, propane, dentist…"
            className="w-full rounded-2xl border border-border px-5 py-4 text-sm bg-white shadow-sm focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
          {businessCategories.map((cat) => (
            <div
              key={cat}
              className="whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Business Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {businesses.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    {b.name}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {b.category} · {b.town}
                  </p>
                </div>
                {!b.mapPinId && (
                  <span className="text-[10px] font-bold text-muted">
                    Map soon
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-muted leading-relaxed">
                {b.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
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
            </div>
          ))}
        </div>

        {/* Suggest CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm text-muted mb-3">
            Know a place we should add?
          </p>
          <button className="rounded-full bg-sunset px-6 py-3 text-sm font-extrabold text-white">
            Suggest a Business
          </button>
        </div>
      </div>
    </div>
  );
}

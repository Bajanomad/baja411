"use client";

import { useMemo, useState } from "react";
import type { Business, BusinessCategory, BusinessTown } from "@/data/businesses";

function matchesSearch(business: Business, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    business.name,
    business.category,
    business.town,
    business.area ?? "",
    business.description,
    business.address ?? "",
    ...business.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

function directionsUrl(business: Business) {
  if (business.latitude && business.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name} ${business.town} Baja California Sur`,
  )}`;
}

function phoneUrl(phone?: string) {
  return phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;
}

function whatsappUrl(whatsapp?: string) {
  if (!whatsapp) return undefined;
  const clean = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}`;
}

export default function BusinessDirectoryClient({
  businesses,
  categories,
  towns,
}: {
  businesses: Business[];
  categories: BusinessCategory[];
  towns: BusinessTown[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BusinessCategory | "All">("All");
  const [town, setTown] = useState<BusinessTown | "All">("All");

  const filtered = useMemo(() => {
    return businesses.filter((business) => {
      if (category !== "All" && business.category !== category) return false;
      if (town !== "All" && business.town !== town) return false;
      return matchesSearch(business, query);
    });
  }, [businesses, category, query, town]);

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setTown("All");
  }

  return (
    <div>
      <div className="rounded-[2rem] border border-border bg-white p-4 shadow-sm md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tacos, mechanic, propane, dentist, rentals..."
            className="w-full rounded-2xl border border-border bg-sand px-5 py-4 text-sm font-semibold text-foreground shadow-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl bg-jade px-7 py-4 text-sm font-extrabold text-white transition hover:bg-jade-light"
          >
            Reset
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">Categories</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setCategory("All")}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold shadow-sm ${
                category === "All" ? "border-jade bg-jade text-white" : "border-border bg-white text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold shadow-sm ${
                  category === cat ? "border-jade bg-jade text-white" : "border-border bg-white text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted">Towns</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setTown("All")}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${
                town === "All" ? "border-jade bg-jade text-white" : "border-border bg-sand text-foreground"
              }`}
            >
              All
            </button>
            {towns.map((place) => (
              <button
                type="button"
                key={place}
                onClick={() => setTown(place)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${
                  town === place ? "border-jade bg-jade text-white" : "border-border bg-sand text-foreground"
                }`}
              >
                {place}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-muted">
          Showing {filtered.length} of {businesses.length} listings
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-extrabold text-foreground">No matches yet.</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
            Try another search, clear the filters, or suggest a place that should be added.
          </p>
          <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-jade px-5 py-3 text-sm font-extrabold text-white">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {filtered.map((business) => {
            const call = phoneUrl(business.phone);
            const whatsapp = whatsappUrl(business.whatsapp);
            return (
              <article key={business.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-sunset">{business.category}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-foreground">{business.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">
                      {business.town}{business.area ? ` · ${business.area}` : ""}
                    </p>
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
                  {call ? (
                    <a href={call} className="rounded-full bg-jade px-4 py-2 text-xs font-extrabold text-white">
                      Call
                    </a>
                  ) : (
                    <span className="rounded-full bg-sand px-4 py-2 text-xs font-extrabold text-muted">No Phone Yet</span>
                  )}
                  {whatsapp && (
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-foreground">
                      WhatsApp
                    </a>
                  )}
                  <a href={directionsUrl(business)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-foreground">
                    Directions
                  </a>
                  <a href={business.mapPinId ? `/map?pin=${business.mapPinId}` : "#directory"} className="rounded-full border border-border px-4 py-2 text-xs font-extrabold text-muted">
                    {business.mapPinId ? "View on Map" : "Map Pin Coming Soon"}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

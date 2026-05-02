import type { Metadata } from "next";
import Link from "next/link";
import { getDirectoryBusinesses } from "@/lib/business-directory";
import { businessCategories, businessTowns } from "@/data/businesses";
import BusinessDirectoryClient from "@/components/BusinessDirectoryClient";

export const metadata: Metadata = {
  title: "Local Directory",
  description:
    "Find useful Baja services, offices, resources, and local help fast.",
};

export default async function BusinessesPage() {
  const businesses = await getDirectoryBusinesses();

  return (
    <div className="min-h-screen bg-sand">
      <section className="relative overflow-hidden bg-night px-5 pb-14 pt-28 text-white">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="label-tag mb-4 block">Local directory</span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.02] md:text-6xl">
              Baja411 Local Directory for everyday services, offices, and practical help.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              Fuel, water, propane, mechanics, medical care, government offices, package receiving, home services, food, and local resources across Baja Sur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#directory" className="inline-flex min-h-14 items-center justify-center rounded-full bg-jade px-7 py-3 text-sm font-extrabold text-white">
                Search Directory
              </a>
              <Link href="/map" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-extrabold text-white">
                Open Map
              </Link>
              <Link href="/businesses/submit" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-extrabold text-white">
                Suggest a Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <BusinessDirectoryClient
            businesses={businesses}
            categories={businessCategories}
            towns={businessTowns}
          />
        </div>
      </section>
    </div>
  );
}

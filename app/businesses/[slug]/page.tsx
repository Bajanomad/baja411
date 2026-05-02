import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDirectoryBusinessBySlug, getRelatedDirectoryBusinesses } from "@/lib/business-directory";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const business = await getDirectoryBusinessBySlug(params.slug);

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: business.name,
    description: business.description,
  };
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const business = await getDirectoryBusinessBySlug(params.slug);

  if (!business) return notFound();

  const related = await getRelatedDirectoryBusinesses(business);

  const directions = business.latitude && business.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.town}`)}`;

  return (
    <div className="min-h-screen bg-sand">
      <section className="bg-night text-white px-5 pt-28 pb-14">
        <div className="max-w-6xl mx-auto">
          <span className="label-tag mb-3 block">{business.category}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold">{business.name}</h1>
          <p className="mt-3 text-white/70 text-sm">{business.town}{business.area ? ` · ${business.area}` : ""}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="bg-jade px-5 py-3 rounded-full text-sm font-extrabold">Call</a>
            )}
            {business.whatsapp && (
              <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" className="border px-5 py-3 rounded-full text-sm font-extrabold">WhatsApp</a>
            )}
            <a href={directions} target="_blank" className="border px-5 py-3 rounded-full text-sm font-extrabold">Directions</a>
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold mb-3">About</h2>
            <p className="text-muted leading-relaxed">{business.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <span key={tag} className="bg-jade-dim text-jade text-xs font-bold px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-3xl p-5 shadow-sm">
            <h3 className="text-lg font-extrabold">Details</h3>
            <div className="mt-4 text-sm text-muted space-y-2">
              {business.address && <p>{business.address}</p>}
              {business.website && (
                <a href={business.website} target="_blank" className="text-jade font-bold">Visit Website</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-5 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-5">Nearby / Related</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/businesses/${item.slug}`} className="bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md">
                  <p className="text-xs text-sunset font-bold">{item.category}</p>
                  <h3 className="font-extrabold mt-1">{item.name}</h3>
                  <p className="text-xs text-muted mt-1">{item.town}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

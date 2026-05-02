import Link from "next/link";

type RuleCard = {
  title: string;
  shortAnswer: string;
  notes: string[];
  sources: { label: string; href: string }[];
  lastChecked: string;
};

const ruleCards: RuleCard[] = [
  {
    title: "Fishing Rules",
    shortAnswer:
      "CONAPESCA says recreational fishing from shore does not require a permit. Fishing from a boat does require a sport fishing permit.",
    notes: [
      "Even when fishing from shore, size limits, closed seasons, catch limits, and permitted gear still apply.",
      "Boat fishing and underwater sport fishing require permits.",
      "Daily catch limits and special species rules can change, so verify before fishing.",
    ],
    sources: [
      { label: "CONAPESCA recreational fishing info", href: "https://www.gob.mx/conapesca/documentos/conapesca-01-016-pesca-deportivo-recreativa" },
      { label: "Sport fishing permit / fees", href: "https://www.gob.mx/tramites/ficha/permiso-de-pesca-deportiva/CONAPESCA2304" },
    ],
    lastChecked: "2026-04-28",
  },
  {
    title: "FMM / Visitor Permit",
    shortAnswer:
      "INM says the electronic FMM for land entry is for visitors without permission to work. It can be valid for up to 180 calendar days and is valid for one entry only.",
    notes: [
      "The validity starts when the migration stamp is applied, assuming entry requirements are met.",
      "Payment does not guarantee entry.",
      "Always verify with INM before travel.",
    ],
    sources: [{ label: "INM eFMM official page", href: "https://www.inm.gob.mx/fmme/" }],
    lastChecked: "2026-04-28",
  },
  {
    title: "Emergency Number",
    shortAnswer: "In Mexico, 9-1-1 is the national emergency number for medical, security, and civil protection emergencies.",
    notes: ["Use it for real emergencies.", "Be ready to provide your location and explain what happened clearly."],
    sources: [{ label: "Gobierno de México 911 information", href: "https://www.gob.mx/911/articulos/que-es-el-911emergencias?idiom=es" }],
    lastChecked: "2026-04-28",
  },
  {
    title: "Ángeles Verdes Roadside Help",
    shortAnswer: "Ángeles Verdes provides tourist roadside assistance and information through 078.",
    notes: [
      "Official coverage information says the service supports travelers on highway stretches across Mexico.",
      "Current official page lists service from 8:00 to 20:00, 365 days a year.",
      "Coverage and availability can vary by route, so verify before relying on it.",
    ],
    sources: [{ label: "Ángeles Verdes official coverage and contacts", href: "https://www.gob.mx/sectur/angelesverdes/articulos/puntos-de-asistencia-carretera?idiom=es" }],
    lastChecked: "2026-04-28",
  },
  {
    title: "Pets Entering Mexico",
    shortAnswer: "SENASICA publishes official guidance for entering Mexico with pets. Their pet guidance focuses on dogs and cats.",
    notes: [
      "Requirements can depend on origin country and frequency of travel.",
      "Frequent travelers should also review SENASICA’s Frequent Traveler Pet Program.",
      "Always verify directly with SENASICA before crossing.",
    ],
    sources: [
      { label: "Pet travel guidance", href: "https://www.gob.mx/senasica/articulos/que-hacer-si-viajas-a-mexico-con-tu-mascota" },
      { label: "Frequent Traveler Pet Program", href: "https://www.gob.mx/senasica/documentos/programa-mascota-viajero-frecuente?state=published" },
    ],
    lastChecked: "2026-04-28",
  },
  {
    title: "Temporary Vehicle Import Permits",
    shortAnswer: "Banjercito/SAT publish official information for temporary import permits for foreign vehicles entering Mexico.",
    notes: [
      "Requirements, deposits, fees, and whether your specific route requires a permit should be verified with the official source before travel.",
      "Do not assume route-specific exemptions here until verified from an official source.",
      "This page points to official Banjercito/SAT information and does not replace those sources.",
    ],
    sources: [
      { label: "Banjercito temporary vehicle import", href: "https://www.gob.mx/banjercito/articulos/sistema-de-importacion-temporal-de-vehiculos" },
      { label: "SAT temporary import permit", href: "https://www.gob.mx/tramites/ficha/permiso-para-importacion-temporal-de-vehiculo-extranjero/SAT2427" },
    ],
    lastChecked: "2026-04-28",
  },
];

const queuedTopics = [
  "Mexican driver’s license",
  "SAPA / water offices",
  "Centro de Salud services",
  "Boating and marine permits",
  "Public health services",
  "Local BCS office locations",
];

export default function RulesPermitsPage() {
  return (
    <main className="bg-night text-white">
      <section className="border-b border-white/10 bg-night/95 pb-12 pt-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sunset/85">Official source starter guide</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Rules &amp; Permits</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            Baja411 summarizes official sources for convenience. Rules can change. Always verify with the linked government or official source before relying on it.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">Last checked: 2026-04-28</p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/50">
            This page is informational only and is not legal advice. Official government sources remain the source of truth.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {ruleCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{card.shortAnswer}</p>
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-sunset/80">Important notes</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/75">
                  {card.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {card.sources.map((source) => (
                  <Link
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-jade/70 px-3 py-1.5 text-xs font-bold text-jade-light transition-colors hover:bg-jade/15"
                  >
                    {source.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold text-white/55">Last checked: {card.lastChecked}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-lg font-bold text-white">Coming next</h2>
          <p className="mt-2 text-sm text-white/70">These topics are queued for verification and are not official summaries yet.</p>
          <ul className="mt-3 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
            {queuedTopics.map((topic) => (
              <li key={topic} className="rounded-xl border border-white/10 bg-night/70 px-3 py-2">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

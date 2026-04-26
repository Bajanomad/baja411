import Link from "next/link";

const contactEmail = "BajaNomad@gmail.com";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white/64">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(42,122,90,0.72) 30%, rgba(232,149,109,0.62) 70%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at top, rgba(42,122,90,0.1) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <Link href="/" className="inline-flex items-baseline text-2xl font-extrabold tracking-tight text-white">
              BAJA <span className="ml-1 text-sunset">411</span>
            </Link>

            <p className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Curated locally, updated often.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
              Road, weather, map, and community intel for people actually moving through Baja California Sur.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-night/45 p-5 sm:p-6 lg:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
              Comments, fixes, missing spots
            </p>
            <a
              href={`mailto:${contactEmail}?subject=Baja%20411%20feedback`}
              className="mt-3 inline-flex break-all text-base font-extrabold text-sunset transition hover:text-white sm:text-lg"
            >
              {contactEmail}
            </a>
            <p className="mt-3 text-xs leading-relaxed text-white/42">
              Send corrections, bug reports, useful local intel, or anything that makes the app less dumb.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-white/[0.07] py-7 text-xs text-white/34 sm:flex-row sm:items-center sm:justify-between">
          <p>Cerritos · Pescadero · Todos Santos · La Paz · Cabo</p>
          <p>Made in Todos Santos, BCS, México</p>
        </div>

        <div className="pt-6 text-center text-xs text-white/25 sm:text-left">
          <p>© {new Date().getFullYear()} Baja 411</p>
        </div>
      </div>
    </footer>
  );
}

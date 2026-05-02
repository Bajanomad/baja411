interface PageHeroProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  pageBg?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="border-b border-white/10 bg-night px-4 py-8 text-white sm:px-5 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <span className="label-tag mb-2 block">{eyebrow}</span>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}

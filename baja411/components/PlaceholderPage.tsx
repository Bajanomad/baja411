import Link from "next/link";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  launchMonth?: string;
  features?: string[];
}

export default function PlaceholderPage({
  eyebrow,
  title,
  description,
  icon,
  launchMonth,
  features,
}: PlaceholderPageProps) {
  return (
    <div className="bg-sand min-h-screen pt-24 pb-16 flex flex-col">
      <div className="max-w-2xl mx-auto px-5 text-center flex flex-col items-center flex-1 justify-center py-20">
        <span className="text-5xl mb-6 block">{icon}</span>

        <span className="label-tag mb-4 block">{eyebrow}</span>

        <h1
          className="font-bold text-foreground mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
        >
          {title}
        </h1>

        <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="text-left space-y-2.5 mb-10 w-full max-w-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted">
                <span className="text-jade mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {launchMonth && (
          <div className="bg-jade-dim border border-jade/20 rounded-2xl px-6 py-4 mb-8 text-sm text-jade font-medium">
            Planned for {launchMonth}
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-jade/30 text-jade font-semibold text-sm hover:bg-jade-dim transition-colors"
        >
          ← Back to Baja 411
        </Link>
      </div>
    </div>
  );
}

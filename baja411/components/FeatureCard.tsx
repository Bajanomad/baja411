import Link from "next/link";

interface FeatureCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  live?: boolean;
}

export default function FeatureCard({
  href,
  icon,
  title,
  description,
  badge,
  live,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 p-6 bg-white rounded-2xl border border-black/[0.07] shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-jade/30 transition-all duration-300"
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-4 right-4 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sunset-dim text-sunset">
          {badge}
        </span>
      )}
      {live && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-jade">
          <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
          Live
        </span>
      )}

      {/* Icon */}
      <span className="text-3xl">{icon}</span>

      {/* Content */}
      <div>
        <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-jade transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>

      {/* Arrow */}
      <span className="mt-auto text-jade text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Explore →
      </span>
    </Link>
  );
}

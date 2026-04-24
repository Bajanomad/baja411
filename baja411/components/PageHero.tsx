import ParallaxImage from "@/components/ParallaxImage";
import WaveDivider from "@/components/WaveDivider";

interface PageHeroProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  pageBg?: string; // wave divider fades into this color
}

export default function PageHero({
  image,
  alt,
  eyebrow,
  title,
  subtitle,
  pageBg = "#FAFAF7",
}: PageHeroProps) {
  return (
    <div className="relative">
      <ParallaxImage
        src={image}
        alt={alt}
        height="480px"
        strength={0.3}
        overlay="linear-gradient(180deg, rgba(6,13,24,0.55) 0%, rgba(6,13,24,0.3) 50%, rgba(6,13,24,0.6) 100%)"
      >
        <div className="text-center px-5 max-w-3xl mx-auto pb-16 md:pb-20">
          <span className="label-tag mb-4 block">{eyebrow}</span>
          <h1
            className="font-extrabold text-white leading-tight drop-shadow-lg"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/70 mt-4 text-lg drop-shadow max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </ParallaxImage>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider fill={pageBg} />
      </div>
    </div>
  );
}

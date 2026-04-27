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
        height="340px"
        strength={0.22}
        overlay="linear-gradient(180deg, rgba(6,13,24,0.72) 0%, rgba(6,13,24,0.42) 52%, rgba(6,13,24,0.78) 100%)"
      >
        <div className="mx-auto max-w-3xl px-5 pb-10 text-center md:pb-12">
          <span className="label-tag mb-3 block">{eyebrow}</span>
          <h1
            className="font-extrabold leading-tight text-white drop-shadow-lg"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-xl text-base text-white/70 drop-shadow md:text-lg">
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

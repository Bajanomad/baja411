export default function HeroWaves() {
  // Three wave paths — each starts and ends at the same Y so they tile seamlessly
  const deep  = "M0,55 C200,15 400,90 720,50 C1040,10 1240,85 1440,55 L1440,120 L0,120 Z";
  const mid   = "M0,65 C300,25 540,95 720,60 C900,25 1140,90 1440,65 L1440,120 L0,120 Z";
  const light = "M0,75 C160,45 360,95 600,70 C840,45 1100,90 1440,72 L1440,120 L0,120 Z";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: 160, zIndex: 15 }}
    >
      {[
        { path: deep,  fill: "rgba(5,45,62,0.88)",   dur: "18s", dir: "normal"  },
        { path: mid,   fill: "rgba(10,100,118,0.72)", dur: "13s", dir: "reverse" },
        { path: light, fill: "rgba(18,155,150,0.58)", dur: "9s",  dir: "normal"  },
      ].map(({ path, fill, dur, dir }) => (
        <div
          key={dur}
          className="hero-wave absolute bottom-0 left-0"
          style={{ width: "200%", animationDuration: dur, animationDirection: dir as "normal" | "reverse" }}
        >
          {[0, 1].map((i) => (
            <svg
              key={i}
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ width: "50%", display: "inline-block", height: 160 }}
            >
              <path d={path} fill={fill} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

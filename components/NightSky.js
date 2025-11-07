export default function NightSky() {
  const colors = [
    "rgba(255,255,255,0.9)", // bright white
    "rgba(255,245,200,0.9)", // soft gold
    "rgba(255,230,150,0.9)", // warmer amber
    "rgba(180,220,255,0.9)", // pale blue
  ];

  const stars = Array.from({ length: 60 }, () => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    size: Math.random() * 8 + 3 + "px",
    delay: Math.random() * 3 + "s",
    rotation: Math.random() * 45,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <>
      <div className="fixed inset-0 z-2 bg-gradient-to-b from-[#220438] via-[#290229] to-[#0e0216] opacity-80">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute  animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              transform: `rotate(${s.rotation}deg)`,
            }}
          >
            {/* Vertical bar */}
            <div
              className="absolute left-1/2 top-0 "
              style={{
                width: "1px",
                height: "100%",
                backgroundColor: s.color,
                transform: "translateX(-50%)",
                boxShadow: `0 0 6px ${s.color}`,
              }}
            ></div>
            {/* Horizontal bar */}
            <div
              className="absolute top-1/2 left-0"
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: s.color,
                transform: "translateY(-50%)",
                boxShadow: `0 0 6px ${s.color}`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="absolute top-48 right-1 animate-moonGlow">
        <svg width="90" height="90" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,230,1)" />
              <stop offset="80%" stopColor="rgba(255,255,230,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,230,0)" />
            </radialGradient>

            <mask id="crescentMask">
              <rect width="100" height="100" fill="black" />
              <circle cx="50" cy="50" r="36" fill="white" />
              <circle cx="42" cy="50" r="30" fill="black" />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#moonGlow)" />

          <g mask="url(#crescentMask)">
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="rgba(255,255,230,0.95)"
            />
            {/* optional subtle edge highlight */}
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="rgba(255,255,230,0.06)"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes moonGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 4px rgba(255, 255, 200, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(255, 255, 230, 0.8));
          }
        }
        .animate-twinkle {
          animation: twinkle 2.5s ease-in-out infinite;
        }
        .animate-moonGlow {
          animation: moonGlow 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

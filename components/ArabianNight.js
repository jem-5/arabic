"use client";

import React, { useMemo } from "react";

// Jewel-tone lantern colors (stable top-level constant)
const COLORS = [
  "#A52A2A", // Burgundy
  "#FF8C00", // Dark Orange
  "#1E3A8A", // Deep Blue
  "#006400", // Deep Green
  "#8B4513", // Earthy Brown
  "#DAA520", // Golden Sand
];

const ArabianNightCelebration = ({ lanternCount = 10, starCount = 50 }) => {
  // Stable seed so positions/delays remain constant while component is mounted
  const seed = useMemo(() => Math.random().toString(36).slice(2, 9), []);

  // Generate lanterns once (stable ids/positions/delays)
  const lanterns = useMemo(
    () =>
      Array.from({ length: lanternCount }).map((_, i) => ({
        id: `${seed}-lantern-${i}`,
        left: `${Math.random() * 90 + 5}%`,
        delay: `${Math.random() * 2}s`,
        scale: 0.4 + Math.random() * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    [lanternCount, seed]
  );

  // Generate stars once (stable positions/delays)
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }).map((_, i) => ({
        id: `${seed}-star-${i}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 2}px`,
        delay: `${Math.random() * 2}s`,
      })),
    [starCount, seed]
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {/* Dark desert night sky */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#310a61] via-[#1b2561] to-[black] z-10 opacity-90 animate-sky" />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-[white] rounded-full animate-twinkle z-20"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            zIndex: 15,
          }}
        />
      ))}

      {/* Floating lanterns */}
      {lanterns.map((lantern) => (
        <svg
          key={lantern.id}
          className="absolute animate-lanternRise w-10 h-20 top-3/4"
          style={{
            left: lantern.left,
            transform: `scale(${lantern.scale})`,
            animationDelay: lantern.delay,
            zIndex: 10,
          }}
          viewBox="0 0 24 40"
          fill="none"
          aria-hidden
        >
          {/* Hook */}
          <rect x="10" y="-4" width="4" height="4" fill="black" rx="1" />

          <circle cx="12" cy="28" r="5" fill="yellow" opacity="0.7" />

          {/* Lantern body */}
          <rect width="24" height="30" rx="4" fill={lantern.color} />

          {/* Moroccan pattern overlay */}
          <defs>
            <pattern
              id={`pattern-${lantern.id}`}
              x="0"
              y="0"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="3,0 3.5,2 6,2 4,3.5 5,6 3,4 1,6 2,3.5 0,2 2.5,2"
                fill="black"
                opacity="0.3"
              />
            </pattern>
          </defs>

          <rect
            width="24"
            height="30"
            rx="4"
            fill={`url(#pattern-${lantern.id})`}
            opacity="0.5"
          />

          {/* Lantern glow */}
          <circle cx="12" cy="28" r="8" fill="yellow" opacity="0.2" />
        </svg>
      ))}

      {/* Styles */}
      <style jsx>{`
        @keyframes lanternRise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          70% {
            transform: translateY(-120px) translateX(10px) scale(1.15);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-400px) translateX(-15px) scale(1);
            opacity: 0;
          }
        }
        .animate-lanternRise {
          animation: lanternRise 3s ease-in-out forwards;
        }

        @keyframes twinkle {
          0% {
            opacity: 1;
          }
          20% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.2;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out forwards;
        }

        @keyframes fade {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-sky {
          animation: fade 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ArabianNightCelebration;

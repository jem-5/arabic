"use client";

import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import FloatingLanternsOverlay from "./Lanterns";

export default function NightSkyWithLanterns() {
  const isBrowser = typeof document !== "undefined";
  const front = isBrowser && document.body.classList.contains("night-sky-front");

  const stars = useMemo(() => {
    const starCount = 60;
    return Array.from({ length: starCount }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 2}s`,
    }));
  }, []);

  const sky = (
    // higher zIndex so the sky darkens page backgrounds and is visible behind lanterns
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: front ? 99998 : 30,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,#241035 0%,#0f1338 50%,#000 100%)",
        }}
      />

      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            background: "#fff",
            borderRadius: "50%",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: 0.8,
            animationDelay: s.delay,
          }}
          className="animate-twinkle"
        />
      ))}

      <style>{`@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}} .animate-twinkle{animation:twinkle 2.5s infinite}`}</style>
    </div>
  );

  const lanterns = (
    // very high zIndex so lanterns float above everything
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: front ? 999999 : 99999,
        pointerEvents: "none",
      }}
    >
      <FloatingLanternsOverlay />
    </div>
  );

  if (!isBrowser) return null;

  return (
    <>
      {createPortal(sky, document.body)}
      {createPortal(lanterns, document.body)}
    </>
  );
}

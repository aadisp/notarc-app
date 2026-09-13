"use client";

import { useEffect, useState } from "react";

interface Star {
  left: number;
  top: number;
  size: number;
  opacity: number;
  glow: boolean;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = [];

    const starCount = 10000;

    for (let i = 0; i < starCount; i++) {
      // Random distribution across the entire area
      const left = Math.random() * 100;
      const top = Math.random() * 100;

      // Most stars are extremely small.
      // Occasionally generate a slightly larger one.
      const size =
        Math.random() < 0.9
          ? Math.random() * 1.2 + 0.4
          : Math.random() * 1.8 + 1;

      // Mostly dim, with occasional brighter stars.
      const opacity =
        Math.random() * 0.45 + 0.2;

      // Only a small number get a subtle glow.
      const glow =
        Math.random() < 0.08;

      generated.push({
        left,
        top,
        size,
        opacity,
        glow,
      });
    }

    setStars(generated);
  }, []);

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
      aria-hidden="true"
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className={`
            absolute
            rounded-full
            bg-white
            ${star.glow ? "shadow-[0_0_6px_rgba(255,255,255,0.65)]" : ""}
          `}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
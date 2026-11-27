"use client";

import { useEffect, useState } from "react";

interface DroneSpeck {
  left: number;
  top: number;
  size: number;
  opacity: number;
  rotation: number;
  glow: boolean;
}

// A tiny quadcopter silhouette — the same shape used for the hovering
// drone icon elsewhere on the site, simplified to a single outline so
// it reads fine at a few pixels tall.
function DroneIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
      <line x1="32" y1="32" x2="14" y2="14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="50" y2="14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="14" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="50" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="14" r="9" stroke="currentColor" strokeWidth="4" />
      <circle cx="14" cy="50" r="9" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="9" stroke="currentColor" strokeWidth="4" />
      <rect x="25" y="25" width="14" height="14" rx="3" fill="currentColor" />
    </svg>
  );
}

export default function RpcSkyfield() {

  const [specks, setSpecks] = useState<DroneSpeck[]>([]);

  useEffect(() => {

    const generated: DroneSpeck[] = [];

    // Far fewer than Starfield's dots — each one is a small shape
    // rather than a single pixel, so a sparse field reads cleaner
    // than a dense one here.
    const speckCount = 110;

    for (let i = 0; i < speckCount; i++) {

      const left = Math.random() * 100;
      const top = Math.random() * 100;

      const size =
        Math.random() < 0.85
          ? Math.random() * 10 + 8
          : Math.random() * 14 + 18;

      const opacity = Math.random() * 0.12 + 0.05;
      const rotation = Math.random() * 360;
      const glow = Math.random() < 0.1;

      generated.push({ left, top, size, opacity, rotation, glow });

    }

    setSpecks(generated);

  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {specks.map((speck, index) => (
        <div
          key={index}
          className={`
            absolute
            text-sky-200
            ${speck.glow ? "drop-shadow-[0_0_6px_rgba(186,230,253,0.5)]" : ""}
          `}
          style={{
            left: `${speck.left}%`,
            top: `${speck.top}%`,
            width: `${speck.size}px`,
            height: `${speck.size}px`,
            opacity: speck.opacity,
            transform: `rotate(${speck.rotation}deg)`,
          }}
        >
          <DroneIcon />
        </div>
      ))}
    </div>
  );

}

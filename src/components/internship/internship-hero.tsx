"use client";

import Image from "next/image";

const HERO_BUTTONS = [
  { id: "internship-vtu", label: "VTU Internship" },
  { id: "internship-industry", label: "Industry Internship" },
  { id: "internship-custom", label: "Custom Internship" },
];

export default function InternshipHero() {

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-screen sm:px-6">

      <style>{`
        @keyframes drone-hover {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-drone-hover {
          animation: drone-hover 3.5s ease-in-out infinite;
        }
      `}</style>

      <Image
        src="/internship-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/55 to-white" />

      <div className="relative z-10 flex flex-col items-center">

        <div className="relative mb-4">

          {/* Drone hovering above the tag */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              -top-10
              z-10
              -translate-x-1/2
              sm:-top-12
            "
          >
            <div className="animate-drone-hover">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="h-8 w-8 text-gray-900 drop-shadow-md sm:h-10 sm:w-10"
              >
                <line x1="32" y1="32" x2="14" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="32" y1="32" x2="50" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="32" y1="32" x2="14" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="32" y1="32" x2="50" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="50" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="14" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
                <rect x="26" y="26" width="12" height="12" rx="3" fill="currentColor" />
              </svg>
            </div>
          </div>

          <span
            className="
              rounded-full
              border
              border-gray-300
              bg-white/70
              px-4
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-gray-700
              backdrop-blur-sm
              sm:text-sm
            "
          >
            Notarc Drones &amp; Robotics
          </span>

        </div>

        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-6xl">
          Internship
          <span className="block text-amber-500">
            Program
          </span>
        </h1>

        <p className="mt-4 text-base font-medium uppercase tracking-[0.3em] text-gray-600 sm:text-lg">
          Learn • Apply • Grow
        </p>

        <p className="mt-3 max-w-xl text-sm text-gray-600 sm:text-base">
          Real projects. Real industry. A path built around where you are.
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row">

          {HERO_BUTTONS.map((button) => (
            <button
              key={button.id}
              onClick={() => scrollToSection(button.id)}
              className="
                w-full
                rounded-full
                border-2
                border-gray-900
                bg-amber-500
                px-6
                py-3
                text-sm
                font-semibold
                text-gray-900
                shadow-sm
                transition
                hover:bg-gray-900
                hover:text-white
                sm:w-auto
              "
            >
              {button.label}
            </button>
          ))}

        </div>

      </div>

    </section>
  );
}
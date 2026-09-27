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

      <Image
        src="/internship-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/75 to-white" />

      <div className="relative z-10 flex flex-col items-center">

        <span
          className="
            mb-4
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
                bg-white
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

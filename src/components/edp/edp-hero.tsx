"use client";

import Image from "next/image";

export default function EdpHero() {

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-screen sm:px-6">

      <Image
        src="/edp-hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0d10]/70 via-[#0b0d10]/60 to-[#0b0d10]" />

      <div className="relative z-10 flex flex-col items-center">

        <div className="relative mb-6 h-24 w-24 sm:h-32 sm:w-32">
          <Image
            src="/edp-logo.png"
            alt="EDP — Ekalavya Drone Program"
            fill
            priority
            sizes="128px"
            className="object-contain"
          />
        </div>

        <span
          className="
            mb-4
            rounded-full
            border
            border-white/20
            px-4
            py-1.5
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-white/80
            sm:text-sm
          "
        >
          Drones • Robotics • Innovation
        </span>

        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Ekalavya
          <span className="block text-amber-400">
            Drone Program
          </span>
        </h1>

        <p className="mt-4 text-base font-medium uppercase tracking-[0.3em] text-white/70 sm:text-lg">
          Learn • Build • Fly
        </p>

        <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">
          Beyond the Classroom. Into the Future.
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row">

          <button
            onClick={() => scrollToSection("edp-about")}
            className="
              w-full
              rounded-full
              border
              border-white/25
              bg-white/5
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              sm:w-auto
            "
          >
            About EDP
          </button>

          <button
            onClick={() => scrollToSection("edp-exam-form")}
            className="
              w-full
              rounded-full
              bg-amber-400
              px-6
              py-3
              text-sm
              font-bold
              text-black
              shadow-lg
              shadow-amber-400/20
              transition
              hover:bg-amber-300
              sm:w-auto
            "
          >
            Take the EDP Entrance Exam
          </button>

        </div>

      </div>

    </section>
  );
}
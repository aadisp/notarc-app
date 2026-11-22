"use client";

import { Button } from "@/components/ui/button";

export default function RpcHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">

        <span
          className="
            mb-4
            rounded-full
            border
            border-white/20
            bg-white/10
            px-3.5
            py-1.5
            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-white
            backdrop-blur-md
            sm:mb-6
            sm:px-5
            sm:py-2
            sm:text-sm
            sm:tracking-widest
          "
        >
          NOTARC &times; Vayuratha Pvt. Ltd.
        </span>

        <h1
          className="text-4xl font-black tracking-tight text-white drop-shadow-2xl sm:text-6xl"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}
        >
          Become a Certified
          <span className="block">Drone Pilot</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-lg">
          Get trained to operate drones professionally through NOTARC&apos;s
          collaboration with Vayuratha Pvt. Ltd. Gain theoretical
          knowledge, practical flying experience, and the training
          required to pursue your Remote Pilot Certificate (RPC).
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-5">

          <Button
            asChild
            variant="outline"
            size="lg"
            className="
              rounded-full
              border-white
              bg-white/10
              px-5
              py-7
              text-base
              font-semibold
              text-white
              backdrop-blur-md
              transition-all
              hover:scale-105
              hover:bg-white
              hover:text-black
              sm:px-8
            "
          >
            <a href="#rpc-about">What is RPC?</a>
          </Button>

          <Button
            asChild
            size="lg"
            className="
              rounded-full
              px-5
              py-7
              text-base
              font-semibold
              shadow-2xl
              transition-all
              hover:scale-105
              sm:px-8
            "
          >
            <a href="#rpc-enquiry">Enquire Now</a>
          </Button>

        </div>

      </div>

    </section>
  );
}
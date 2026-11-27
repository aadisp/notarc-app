"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RpcHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">

        {/* Logo lockup — moved up from the Partners section so the
            partnership is the first thing visitors see */}
        <div className="mb-6 flex items-center justify-center gap-5 sm:mb-8 sm:gap-7">

          <div className="relative h-7 w-24 sm:h-8 sm:w-28">
            <Image
              src="/ntrclogo.png"
              alt="NOTARC"
              fill
              priority
              sizes="112px"
              className="object-contain"
            />
          </div>

          <span className="text-lg font-light text-slate-400 sm:text-xl">
            &times;
          </span>

          <div className="relative h-8 w-28 sm:h-9 sm:w-32">
            <Image
              src="/vayuratha-logo.png"
              alt="Vayuratha"
              fill
              priority
              sizes="128px"
              className="object-contain"
            />
          </div>

        </div>

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
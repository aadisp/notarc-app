import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBackground from "./hero-background";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

      <HeroBackground />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/55" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">

        <span
          className="
            mb-6
            rounded-full
            border
            border-white/20
            bg-white/10
            px-5
            py-2
            text-sm
            font-medium
            tracking-widest
            uppercase
            text-white
            backdrop-blur-md
          "
        >
          Drones • Robotics • Innovation
        </span>

        <h1
          className="
            text-6xl
            font-black
            tracking-tight
            text-white
            drop-shadow-2xl
            md:text-8xl
          "
        >
          NOTARC
        </h1>

        <p
          className="
            mt-6
            max-w-3xl
            text-lg
            leading-8
            text-slate-200
            md:text-2xl
          "
        >
          Building the next generation of drone engineers through
          immersive workshops, industry-grade hardware, robotics,
          and practical learning.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Button
            asChild
            size="lg"
            className="
              rounded-full
              px-8
              py-7
              text-base
              font-semibold
              shadow-2xl
              transition-all
              hover:scale-105
            "
          >
            <Link href="/products">
              Explore Products
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="
              rounded-full
              border-white
              bg-white/10
              px-8
              py-7
              text-base
              font-semibold
              text-white
              backdrop-blur-md
              transition-all
              hover:scale-105
              hover:bg-white
              hover:text-black
            "
          >
            <Link href="/courses">
              Browse Courses
            </Link>
          </Button>

        </div>

      </div>

    </section>
  );
}
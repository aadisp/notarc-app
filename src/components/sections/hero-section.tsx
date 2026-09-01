import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBackground from "./hero-background";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden sm:min-h-[88vh] md:min-h-screen">

      <HeroBackground />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/55" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">

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
            tracking-[0.18em]
            uppercase
            text-white
            backdrop-blur-md
            sm:mb-6
            sm:px-5
            sm:py-2
            sm:text-sm
            sm:tracking-widest
          "
        >
          Drones • Robotics • Innovation
        </span>

        <h1
          className="
            text-5xl sm:text-6xl md:text-8xl
            font-black
            tracking-tight
            text-white
            drop-shadow-2xl
            md:text-8xl
          "
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 600 }}
        >
          notarc
        </h1>

        <p
          className="
            mt-4
            max-w-[90%]
            text-sm
            leading-6
            text-slate-200
            sm:mt-6
            sm:max-w-3xl
            sm:text-lg
            sm:leading-8
            md:text-2xl
          "
        >
          Unleashing Innovation:
          Drones,
          Robotics, and Beyond!
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-5">

          <Button
            asChild
            variant="outline"
            size="lg"
            className="
              rounded-full
              border-white
              bg-white/10
              px-5 sm:px-8
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
            <Link href="/products">
              Explore Products
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            className="
              rounded-full
              px-5 sm:px-8
              py-7
              text-base
              font-semibold
              shadow-2xl
              transition-all
              hover:scale-105
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
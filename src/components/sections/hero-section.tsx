import { Button } from "@/components/ui/button";
import HeroBackground from "./hero-background";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden">

      <HeroBackground />

      <div className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-7xl font-extrabold tracking-tight md:text-8xl">
          NOTARC
        </h1>

        <p className="max-w-3xl text-lg md:text-xl">
          Unleashing Innovation:
          Drones, Robotics, and Beyond!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">
            Explore Products
          </Button>

          <Button
            variant="outline"
            size="lg"
          >
            Browse Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
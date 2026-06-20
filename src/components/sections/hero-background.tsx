"use client";

import Image from "next/image";
import { heroImages } from "@/lib/hero-images";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <Image
          src={heroImages[index]}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
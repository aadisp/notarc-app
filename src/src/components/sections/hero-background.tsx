"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroBackground() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          ref={videoRef}
          src="/hero-bg.mp4"
          poster="/hero/hero1.png"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="
            h-full
            w-full
            object-cover
            object-[50%_40%]
            sm:object-center
          "
        />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <button
        onClick={() => setIsMuted((muted) => !muted)}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="
          absolute
          bottom-6
          left-6
          z-30
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/15
          bg-white/10
          text-white
          backdrop-blur-md
          transition-colors
          hover:bg-white/20
        "
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
    </>
  );
}
"use client";

import { ReactNode } from "react";

interface AuthBackgroundProps {
  children: ReactNode;
}

export default function AuthBackground({
  children,
}: AuthBackgroundProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b0d10] via-[#0d1116] to-[#0b1420] px-6">

      {/* Background Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
          [background-image:linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)]
          [background-size:50px_50px]
        "
      />

      {/* Blue Glow */}
      <div
        className="
          absolute
          left-[-150px]
          top-[-150px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-blue-500/20
          blur-[120px]
        "
      />

      {/* Cyan Glow */}
      <div
        className="
          absolute
          bottom-[-200px]
          right-[-150px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-400/20
          blur-[150px]
        "
      />

      {/* Purple Glow */}
      <div
        className="
          absolute
          right-1/4
          top-1/3
          h-[300px]
          w-[300px]
          rounded-full
          bg-indigo-400/10
          blur-[120px]
        "
      />

      <div className="relative z-10 w-full max-w-7xl">
        {children}
      </div>
    </main>
  );
}
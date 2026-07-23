"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthCard({
  children,
  title,
  subtitle,
}: AuthCardProps) {
  return (
    <div className="grid items-center gap-16 lg:grid-cols-2">

      {/* Left Side */}
      <div className="hidden lg:block">

        <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          NOTARC
        </span>

        <h1 className="mt-8 text-6xl font-black leading-tight tracking-tight">
          Engineering
          <br />
          the Future.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          Build drones, robotics systems, and real-world engineering
          skills with NOTARC. Access premium products, practical
          courses, and your engineering workspace in one place.
        </p>

        <div className="mt-12 flex gap-6">

          <div>
            <h2 className="text-4xl font-black">500+</h2>
            <p className="text-muted-foreground">
              Students
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black">50+</h2>
            <p className="text-muted-foreground">
              Projects
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black">100%</h2>
            <p className="text-muted-foreground">
              Practical
            </p>
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div
        className="
          rounded-3xl
          border
          border-white/40
          bg-white/70
          p-10
          shadow-2xl
          backdrop-blur-xl
        "
      >

        <div className="mb-10">

          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Welcome
          </span>

          <h2 className="mt-3 text-4xl font-black">
            {title}
          </h2>

          <p className="mt-3 text-muted-foreground">
            {subtitle}
          </p>

        </div>

        {children}

      </div>

    </div>
  );
}
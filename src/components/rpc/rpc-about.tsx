"use client";

import { Check } from "lucide-react";

const WHY_RPC = [
  "Learn professional drone operation.",
  "Gain practical flying experience.",
  "Understand drone safety and aviation regulations.",
  "Develop skills for commercial drone applications.",
  "Explore career opportunities in the growing drone industry.",
];

export default function RpcAbout() {
  return (
    <section
      id="rpc-about"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="grid gap-10 rounded-3xl border bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-2">

        <div>

          <h2 className="text-3xl font-bold sm:text-4xl">
            What is a Remote Pilot Certificate?
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">

            <p>
              A Remote Pilot Certificate (RPC) is an official
              certification issued through the DGCA-authorised process
              for individuals who successfully complete the prescribed
              remote pilot training and assessment.
            </p>

            <p>
              It enables eligible individuals to operate drones in the
              applicable category and class, subject to Indian aviation
              regulations.
            </p>

          </div>

        </div>

        <div>

          <h3 className="text-xl font-bold">
            Why Get RPC Certified?
          </h3>

          <ul className="mt-5 space-y-3">
            {WHY_RPC.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span className="text-sm leading-6 text-muted-foreground sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>

        </div>

      </div>

    </section>
  );
}
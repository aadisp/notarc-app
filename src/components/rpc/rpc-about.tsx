"use client";

import { CheckCircle2 } from "lucide-react";

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
      className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          About RPC
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          What is a Remote Pilot Certificate?
        </h2>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left text-sm leading-7 text-gray-600 sm:text-base">

          <p>
            A Remote Pilot Certificate (RPC) is an official certification
            issued through the DGCA-authorised process for individuals
            who successfully complete the prescribed remote pilot
            training and assessment.
          </p>

          <p>
            It enables eligible individuals to operate drones in the
            applicable category and class, subject to Indian aviation
            regulations.
          </p>

        </div>

      </div>

      <div className="mt-14">

        <h3 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
          Why Get RPC Certified?
        </h3>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">

          {WHY_RPC.map((item) => (

            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-sm leading-6 text-gray-700">
                {item}
              </span>
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

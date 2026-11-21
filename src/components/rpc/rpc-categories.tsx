"use client";

import { Check } from "lucide-react";

const CATEGORIES = [
  {
    name: "Small Category",
    description:
      "Professional training for operating Small Category drones.",
    applications: [
      "Aerial photography and videography",
      "Surveying and mapping",
      "Agricultural applications",
      "Industrial inspections",
    ],
  },
  {
    name: "Medium Category",
    description:
      "Professional training for operating Medium Category drones.",
    applications: [
      "Agricultural operations",
      "Industrial applications",
      "Infrastructure inspection",
      "Advanced commercial drone operations",
    ],
  },
];

export default function RpcCategories() {
  return (
    <section
      id="rpc-categories"
      className="scroll-mt-24 border-t border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-5xl text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          Categories
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Training Categories
        </h2>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">

          {CATEGORIES.map((category) => (

            <div
              key={category.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm sm:p-8"
            >

              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                {category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {category.description}
              </p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                Suitable Applications
              </p>

              <ul className="mt-3 space-y-2">
                {category.applications.map((application) => (
                  <li
                    key={application}
                    className="flex items-start gap-2 text-sm leading-6 text-gray-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {application}
                  </li>
                ))}
              </ul>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

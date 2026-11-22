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
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Training Categories
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">

        {CATEGORIES.map((category) => (

          <div
            key={category.name}
            className="rounded-3xl border bg-card p-6 text-left shadow-sm sm:p-8"
          >

            <h3 className="text-lg font-bold">
              {category.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {category.description}
            </p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suitable Applications
            </p>

            <ul className="mt-3 space-y-2">
              {category.applications.map((application) => (
                <li
                  key={application}
                  className="flex items-start gap-2 text-sm leading-6"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {application}
                </li>
              ))}
            </ul>

          </div>

        ))}

      </div>

    </section>
  );
}
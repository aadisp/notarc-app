"use client";

import { Check } from "lucide-react";

const PROGRAMME_TOPICS = [
  "Introduction to drone technology",
  "Drone components and working principles",
  "Aviation rules and regulations",
  "Airspace awareness and safety",
  "Flight preparation and procedures",
  "Practical drone flying",
  "Operational safety and emergency procedures",
  "Training assessment",
];

const ELIGIBILITY = [
  "Minimum age: 18 years.",
  "Minimum educational qualification: Class 10 pass or equivalent from a recognised board.",
  "Required identity and address documentation.",
  "Additional requirements as prescribed by the authorised RPTO and applicable DGCA regulations.",
];

export default function RpcProgramme() {
  return (
    <section
      id="rpc-programme"
      className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="rounded-3xl border bg-card p-8 shadow-sm sm:p-12">

        <div className="text-center">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Training Programme
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Our training programme combines theoretical learning with
            practical drone operation.
          </p>

        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">

          {PROGRAMME_TOPICS.map((topic) => (
            <div key={topic} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm leading-6">
                {topic}
              </span>
            </div>
          ))}

        </div>

        <div className="mx-auto mt-12 max-w-xl border-t pt-10">

          <h3 className="text-center text-xl font-bold">
            Eligibility Criteria
          </h3>

          <ul className="mt-6 space-y-3">
            {ELIGIBILITY.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

        </div>

      </div>

    </section>
  );
}
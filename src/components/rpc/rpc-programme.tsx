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
      className="scroll-mt-24 border-t border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-4xl">

        <div className="text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            Programme
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Training Programme
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Our training programme combines theoretical learning with
            practical drone operation.
          </p>

        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-2 sm:grid-cols-2">

          {PROGRAMME_TOPICS.map((topic) => (
            <div
              key={topic}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="text-sm leading-6 text-gray-700">
                {topic}
              </span>
            </div>
          ))}

        </div>

        <div className="mx-auto mt-14 max-w-2xl">

          <h3 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Eligibility Criteria
          </h3>

          <ul className="mx-auto mt-6 max-w-xl space-y-3">
            {ELIGIBILITY.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-7 text-gray-600 sm:text-base"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                {item}
              </li>
            ))}
          </ul>

        </div>

      </div>

    </section>
  );
}

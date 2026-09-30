"use client";

import Link from "next/link";

const DETAILS = [
  { label: "Duration", value: "4–5 Months" },
  {
    label: "Focus",
    value:
      "Practical Skills • Industry Projects • Technical Training • Industry Exposure • Professional Development",
  },
];

export default function InternshipIndustry() {
  return (
    <section
      id="internship-industry"
      className="scroll-mt-24 border-t border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-3xl text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          Industry
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Industry Learning &amp;
          <br />
          Project Internship
        </h2>

        <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Learn • Build • Experience • Innovate
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-sm leading-7 text-gray-600 sm:text-base">

          <p>
            Take your engineering knowledge beyond the classroom with 4–5
            months of practical, industry-oriented learning at NOTARC
            Drones &amp; Robotics. Designed for students from autonomous
            institutions and engineering colleges, the program focuses on
            hands-on technical training, real-world projects, industry
            practices, problem-solving, and professional development.
          </p>

          <p>
            Students get an opportunity to work with emerging
            technologies, gain practical experience, collaborate on
            projects, and understand how engineering concepts are applied
            in real industry environments.
          </p>

        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">

          {DETAILS.map((detail) => (
            <div
              key={detail.label}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                {detail.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                {detail.value}
              </p>
            </div>
          ))}

        </div>

        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSf-rg7Pr3T162EYVOTifs75gCyPgvZo09maeSU-yiZdjQSR3g/viewform?usp=dialog"
          className="
            mt-10
            inline-block
            rounded-full
            bg-amber-500
            px-8
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-amber-500/20
            transition
            hover:bg-amber-600
          "
        >
          Enquire Now
        </Link>

      </div>

    </section>
  );
}
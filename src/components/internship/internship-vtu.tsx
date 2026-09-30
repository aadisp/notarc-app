"use client";

import Image from "next/image";
import Link from "next/link";

const DETAILS = [
  { label: "Duration", value: "4–5 Months" },
  { label: "Mode", value: "Industry-Oriented Practical Learning" },
  {
    label: "Focus",
    value: "Skills • Projects • Industry Exposure • Professional Development",
  },
];

export default function InternshipVtu() {
  return (
    <section
      id="internship-vtu"
      className="scroll-mt-24 border-t border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-3xl text-center">

        <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full ring-2 ring-white shadow-md sm:h-20 sm:w-20">
          <Image
            src="/vtu-logo.png"
            alt="Visvesvaraya Technological University"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          VTU
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          VTU-Approved Industry
          <br />
          Internship Program
        </h2>

        <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Learn • Build • Work • Innovate
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-sm leading-7 text-gray-600 sm:text-base">

          <p>
            Step beyond the classroom and gain 4–5 months of practical,
            industry-oriented learning with NOTARC. Our VTU-approved
            internship program is designed to help engineering students
            experience real-world technologies, hands-on projects,
            technical training, problem-solving, teamwork, and industry
            workflows.
          </p>

          <p>
            Students get the opportunity to learn from industry
            professionals, work on practical projects, develop technical
            skills, and build experience that supports their transition
            from engineering student to industry-ready professional.
          </p>

        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">

          {DETAILS.map((detail) => (
            <div
              key={detail.label}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left"
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
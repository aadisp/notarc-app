"use client";

import Link from "next/link";

const DETAILS = [
  { label: "Duration", value: "4–5 Months" },
  { label: "Format", value: "Customized Industry Internship" },
  {
    label: "Focus",
    value: "Skills • Projects • Mentorship • Industry Exposure • Practical Learning",
  },
];

export default function InternshipCustom() {
  return (
    <section
      id="internship-custom"
      className="scroll-mt-24 border-t border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-3xl text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          Custom
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Custom Industry
          <br />
          Internship Program
        </h2>

        <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Your Institution. Your Requirements. Your Industry Learning.
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-sm leading-7 text-gray-600 sm:text-base">

          <p>
            A flexible 4–5 month industry internship program designed
            around the requirements of each institution, department, and
            student. At NOTARC Drones &amp; Robotics, we customize
            internship pathways based on student interests, academic
            curriculum, emerging technologies, and industry requirements.
          </p>

          <p>
            Students can gain hands-on experience through technical
            training, real-world projects, industry mentoring,
            problem-solving, and practical implementation. From drones
            and robotics to embedded systems, IoT, automation, software,
            and emerging technologies — the internship can be structured
            to match the learning goals of the institution.
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
            target=_blank
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
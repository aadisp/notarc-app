"use client";

import { CheckCircle2 } from "lucide-react";

const JOURNEY_STEPS = [
  "Explore",
  "Learn",
  "Build",
  "Master",
  "Innovate",
  "Intern",
  "Connect",
  "Launch",
];

const STUDENT_EXPERIENCE = [
  "Explore drones, robotics and emerging technologies.",
  "Learn through hands-on technical activities and guided projects.",
  "Build, test, troubleshoot and improve real systems.",
  "Work in teams on innovation challenges.",
  "Develop industry-oriented prototypes and products.",
  "Receive mentorship from technical and industry professionals.",
  "Gain exposure to real-world technology applications.",
  "Pursue internship opportunities based on eligibility and applicable requirements.",
  "Connect with industry, innovation and career networks.",
];

export default function EdpAbout() {
  return (
    <section
      id="edp-about"
      className="mx-auto max-w-4xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24"
    >

      {/* Intro */}
      <div className="mb-14 text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
          About EDP
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          Beyond the Classroom.
          <br />
          Into the Future.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          The Ekalavya Drone Program (EDP) is a structured, long-term
          learning and innovation initiative designed to run alongside an
          engineering degree — helping students move beyond classroom
          learning into drone technology, robotics, electronics, software,
          autonomous systems and industry applications.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
          Through practical learning, mentorship, product development and
          industry engagement, students develop the confidence and
          capability to contribute to the future of advanced technology.
          The program is designed and delivered by NOTARC Drones &amp;
          Robotics in collaboration with engineering institutions.
        </p>

      </div>

      {/* Journey */}
      <div className="mb-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">

        <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
          The EDP Journey
        </h3>

        <p className="mt-1 text-center text-sm text-white/50">
          A Four-Year Pathway to Innovation
        </p>

        <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">

          {JOURNEY_STEPS.map((step, index) => (

            <div key={step} className="flex items-center gap-4">

              <div className="flex flex-col items-center">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-400
                    text-xs
                    font-bold
                    text-black
                  "
                >
                  {index + 1}
                </div>

                {index < JOURNEY_STEPS.length - 1 && (
                  <div className="h-6 w-px bg-white/15" />
                )}

              </div>

              <span className="pb-6 text-sm font-semibold text-white sm:text-base">
                {step}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Student Experience */}
      <div className="mb-14">

        <h3 className="text-xl font-bold text-white sm:text-2xl">
          Student Experience
        </h3>

        <p className="mt-1 text-sm text-white/50">
          Learn Beyond Limits. Build What Matters.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          {STUDENT_EXPERIENCE.map((item) => (

            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span className="text-sm leading-6 text-white/70">
                {item}
              </span>
            </div>

          ))}

        </div>

      </div>

      {/* Industry projects + internship */}
      <div className="mb-14 space-y-6">

        <div>
          <h3 className="text-lg font-bold text-white">
            Industry-Oriented Projects
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/60">
            EDP helps students move from learning technology to applying
            it. Students can develop industry-oriented products and
            prototypes based on real time application, creating solutions
            that address practical needs while building strong technical
            and product-development experience.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            Internship &amp; Industry Connect
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/60">
            Eligible students may receive internship opportunities through
            NOTARC, subject to applicable institutional, university and
            company requirements — alongside project mentorship, technical
            guidance and industry-oriented exposure. After internships and
            practical learning, EDP connects students with industry
            professionals, startups, alumni, research opportunities and
            innovation networks.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            Future Opportunities
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/60">
            EDP prepares students for emerging roles in drone and UAV
            engineering, robotics, embedded systems, automation,
            autonomous systems, GIS and surveying, R&amp;D, product
            development and technology entrepreneurship.
          </p>
        </div>

      </div>

      {/* Vision / Mission */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            Vision
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            To build a generation of industry-ready engineers and
            innovators who can design, develop and deploy next-generation
            drone and autonomous technologies to solve real-world
            problems.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
            Mission
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            To identify and nurture high-potential engineering students
            through a structured four-year learning journey that combines
            academic knowledge, hands-on technology training, industry
            exposure, internships, real-world projects and career
            development.
          </p>
        </div>

      </div>

    </section>
  );
}
"use client";

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
  { label: "Age", value: "18 years, minimum" },
  {
    label: "Education",
    value: "Class 10 pass or equivalent, recognised board",
  },
  { label: "Documentation", value: "Valid identity and address proof" },
  {
    label: "Additional",
    value: "As prescribed by the authorised RPTO and DGCA",
  },
];

export default function RpcProgramme() {
  return (
    <section
      id="rpc-programme"
      className="scroll-mt-24 border-t border-slate-100 bg-white px-4 py-20 sm:px-6 sm:py-28"
    >

      <div className="mx-auto max-w-4xl">

        <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-sky-600">
          04 — Training Programme
        </p>

        <h2 className="mt-3 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Pre-Flight Checklist
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-slate-600 sm:text-base">
          Our training programme combines theoretical learning with
          practical drone operation.
        </p>

        <div className="mx-auto mt-10 max-w-2xl border border-slate-200">

          {PROGRAMME_TOPICS.map((topic, index) => (
            <div
              key={topic}
              className="
                flex
                items-center
                gap-4
                border-b
                border-slate-100
                px-5
                py-4
                last:border-b-0
                odd:bg-slate-50/60
              "
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-sky-500">
                <span className="h-1.5 w-1.5 bg-sky-500" />
              </span>
              <span className="font-mono text-xs text-slate-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-6 text-slate-700 sm:text-base">
                {topic}
              </span>
            </div>
          ))}

        </div>

        <div className="mx-auto mt-16 max-w-2xl">

          <h3 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
            Eligibility Criteria
          </h3>

          <div className="mt-6 divide-y divide-slate-200 border border-slate-200 font-mono text-xs sm:text-sm">
            {ELIGIBILITY.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-3 gap-4 px-5 py-3"
              >
                <span className="uppercase tracking-[0.15em] text-slate-400">
                  {item.label}
                </span>
                <span className="col-span-2 text-slate-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
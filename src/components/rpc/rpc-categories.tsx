"use client";

const CATEGORIES = [
  {
    code: "RPC-S",
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
    code: "RPC-M",
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
      className="scroll-mt-24 border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 sm:py-28"
    >

      <div className="mx-auto max-w-5xl">

        <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-sky-600">
          02 — Training Categories
        </p>

        <h2 className="mt-3 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Choose Your Class
        </h2>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">

          {CATEGORIES.map((category) => (

            <div
              key={category.code}
              className="relative border border-slate-200 bg-white shadow-sm"
            >

              {/* Perforated tear line between header and applications,
                  with notches cut into the card edges */}
              <div
                className="absolute -left-2 top-[88px] h-4 w-4 rounded-full bg-slate-50"
              />
              <div
                className="absolute -right-2 top-[88px] h-4 w-4 rounded-full bg-slate-50"
              />

              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    {category.code}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {category.name}
                  </h3>
                </div>
                <span className="h-10 w-10 shrink-0 border border-sky-500/30 bg-sky-50" />
              </div>

              <div className="border-t border-dashed border-slate-300" />

              <div className="px-6 py-6">

                <p className="text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Suitable Applications
                </p>

                <ul className="mt-3 space-y-2">
                  {category.applications.map((application) => (
                    <li
                      key={application}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500" />
                      {application}
                    </li>
                  ))}
                </ul>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
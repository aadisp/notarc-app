"use client";

const WHY_RPC = [
  "Learn professional drone operation.",
  "Gain practical flying experience.",
  "Understand drone safety and aviation regulations.",
  "Develop skills for commercial drone applications.",
  "Explore career opportunities in the growing drone industry.",
];

export default function RpcAbout() {
  return (
    <section
      id="rpc-about"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28"
    >

      <div className="grid gap-12 lg:grid-cols-2">

        <div>

          <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-600">
            01 — About RPC
          </p>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            What is a Remote
            <br />
            Pilot Certificate?
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">

            <p>
              A Remote Pilot Certificate (RPC) is an official
              certification issued through the DGCA-authorised process
              for individuals who successfully complete the prescribed
              remote pilot training and assessment.
            </p>

            <p>
              It enables eligible individuals to operate drones in the
              applicable category and class, subject to Indian aviation
              regulations.
            </p>

          </div>

        </div>

        <div>

          <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-600">
            Why Get Certified
          </p>

          {/* Ticket-stub list — a dashed spine with each benefit as a
              stub reading off of it, instead of a card grid */}
          <ul className="mt-4 border-l-2 border-dashed border-slate-300 pl-6">

            {WHY_RPC.map((item, index) => (
              <li
                key={item}
                className="
                  relative
                  border-b
                  border-slate-100
                  py-4
                  text-sm
                  leading-6
                  text-slate-700
                  last:border-b-0
                  sm:text-base
                "
              >
                <span
                  className="
                    absolute
                    -left-[29px]
                    top-5
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-sky-500
                  "
                />
                <span className="mr-2 font-mono text-xs text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}

          </ul>

        </div>

      </div>

    </section>
  );
}
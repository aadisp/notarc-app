"use client";

const FLIGHT_DATA = [
  { label: "CERT.", value: "RPC" },
  { label: "DURATION", value: "4–5 WEEKS" },
  { label: "ISSUED BY", value: "DGCA" },
];

export default function RpcHero() {

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative overflow-hidden bg-[#0b1220] px-4 py-24 sm:px-6 sm:py-32">

      <style>{`
        @keyframes rpc-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .rpc-sweep-line {
          animation: rpc-sweep 6s linear infinite;
        }
      `}</style>

      {/* Radar-line texture in the background, aviation-flavoured rather
          than decorative noise */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15]">
        <div className="absolute inset-x-0 top-1/4 h-px bg-sky-400" />
        <div className="absolute inset-x-0 top-2/4 h-px bg-sky-400" />
        <div className="absolute inset-x-0 top-3/4 h-px bg-sky-400" />
        <div className="rpc-sweep-line absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-sky-400 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">

        <span
          className="
            inline-block
            border
            border-sky-400/30
            bg-sky-400/10
            px-3
            py-1
            font-mono
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-sky-300
          "
        >
          Notarc &times; Vayuratha Pvt. Ltd.
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Become a Certified
          <span className="block text-sky-400">
            Drone Pilot
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          Get trained to operate drones professionally through NOTARC&apos;s
          collaboration with Vayuratha Pvt. Ltd. Gain theoretical
          knowledge, practical flying experience, and the training
          required to pursue your Remote Pilot Certificate (RPC).
        </p>

        {/* Boarding-pass style data strip */}
        <div
          className="
            mx-auto
            mt-10
            flex
            max-w-md
            items-stretch
            divide-x
            divide-slate-700
            border
            border-slate-700
            bg-white/[0.03]
          "
        >
          {FLIGHT_DATA.map((item) => (
            <div key={item.label} className="flex-1 px-3 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">

          <button
            onClick={() => scrollToSection("rpc-about")}
            className="
              w-full
              max-w-xs
              rounded-lg
              border
              border-slate-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:border-sky-400
              hover:text-sky-300
              sm:w-auto
            "
          >
            What is RPC?
          </button>

          <button
            onClick={() => scrollToSection("rpc-enquiry")}
            className="
              w-full
              max-w-xs
              rounded-lg
              bg-sky-500
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-sky-500/20
              transition
              hover:bg-sky-400
              sm:w-auto
            "
          >
            Enquire Now
          </button>

        </div>

      </div>

    </section>
  );
}
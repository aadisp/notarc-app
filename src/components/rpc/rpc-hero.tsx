"use client";

export default function RpcHero() {

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 py-20 text-center sm:px-6">

      <style>{`
        @keyframes rpc-drone-hover {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-rpc-drone-hover {
          animation: rpc-drone-hover 3.5s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center">

        <div className="mb-6 animate-rpc-drone-hover">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-12 w-12 text-gray-900 sm:h-14 sm:w-14"
          >
            <line x1="32" y1="32" x2="14" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="32" x2="50" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="32" x2="14" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="32" x2="50" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="50" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="14" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
            <rect x="26" y="26" width="12" height="12" rx="3" fill="currentColor" />
          </svg>
        </div>

        <span
          className="
            mb-4
            rounded-full
            border
            border-gray-300
            bg-white
            px-4
            py-1.5
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-gray-700
            sm:text-sm
          "
        >
          NOTARC &times; Vayuratha Pvt. Ltd.
        </span>

        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-6xl">
          Become a Certified
          <span className="block text-amber-500">
            Drone Pilot
          </span>
        </h1>

        <p className="mt-4 text-base font-medium uppercase tracking-[0.3em] text-gray-600 sm:text-lg">
          Turn Your Passion Into a Profession
        </p>

        <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
          Get trained to operate drones professionally through NOTARC&apos;s
          collaboration with Vayuratha Pvt. Ltd. Gain theoretical
          knowledge, practical flying experience, and the training
          required to pursue your Remote Pilot Certificate (RPC).
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row">

          <button
            onClick={() => scrollToSection("rpc-about")}
            className="
              w-full
              rounded-full
              border-2
              border-gray-900
              bg-white
              px-6
              py-3
              text-sm
              font-semibold
              text-gray-900
              shadow-sm
              transition
              hover:bg-gray-900
              hover:text-white
              sm:w-auto
            "
          >
            What is RPC?
          </button>

          <button
            onClick={() => scrollToSection("rpc-enquiry")}
            className="
              w-full
              rounded-full
              bg-amber-500
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-amber-500/20
              transition
              hover:bg-amber-600
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

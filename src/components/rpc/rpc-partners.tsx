"use client";

import Image from "next/image";

const PARTNERS = [
  {
    name: "NOTARC",
    logo: "/ntrclogo.png",
    logoClassName: "h-9",
    role: "Technology, drone education, student outreach and training coordination.",
  },
  {
    name: "Vayuratha Pvt. Ltd.",
    logo: "/vayuratha-logo.png",
    logoClassName: "h-10",
    role: "Training infrastructure, practical flying sessions and authorised RPTO training operations.",
  },
];

export default function RpcPartners() {
  return (
    <section
      id="rpc-partners"
      className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 text-center sm:px-6 sm:py-24"
    >

      <h2 className="text-3xl font-bold text-white sm:text-4xl">
        Our Training Partners
      </h2>

      {/* Logo lockup — the two partner marks separated by an × */}
      <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-6 sm:gap-10">

        <div className="relative h-9 w-32">
          <Image
            src="/ntrclogo.png"
            alt="NOTARC"
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>

        <span className="text-xl font-light text-slate-500">&times;</span>

        <div className="relative h-10 w-40">
          <Image
            src="/vayuratha-logo.png"
            alt="Vayuratha"
            fill
            sizes="160px"
            className="object-contain"
          />
        </div>

      </div>

      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
        Bringing professional drone education and certified pilot
        training together.
      </p>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">

        {PARTNERS.map((partner) => (

          <div
            key={partner.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md"
          >
            <h3 className="text-base font-bold text-white">
              {partner.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {partner.role}
            </p>
          </div>

        ))}

      </div>

      <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-slate-400">
        Training is jointly managed by both organisations and
        conducted at the Vayuratha training centre.
      </p>

    </section>
  );
}
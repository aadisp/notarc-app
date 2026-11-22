"use client";

const PARTNERS = [
  {
    name: "NOTARC",
    role: "Technology, drone education, student outreach and training coordination.",
  },
  {
    name: "Vayuratha Pvt. Ltd.",
    role: "Training infrastructure, practical flying sessions and authorised RPTO training operations.",
  },
];

export default function RpcPartners() {
  return (
    <section
      id="rpc-partners"
      className="scroll-mt-24 bg-[#0b1220] px-4 py-20 sm:px-6 sm:py-28"
    >

      <div className="mx-auto max-w-3xl text-center">

        <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">
          03 — Our Training Partners
        </p>

        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          NOTARC <span className="text-sky-400">&times;</span> Vayuratha
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          Bringing professional drone education and certified pilot
          training together.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">

          {PARTNERS.map((partner) => (

            <div
              key={partner.name}
              className="border border-white/10 bg-white/[0.03] p-6 text-left"
            >
              <h3 className="text-base font-bold uppercase tracking-wide text-white">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {partner.role}
              </p>
            </div>

          ))}

        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-slate-500">
          Training is jointly managed by both organisations and
          conducted at the Vayuratha training centre.
        </p>

      </div>

    </section>
  );
}
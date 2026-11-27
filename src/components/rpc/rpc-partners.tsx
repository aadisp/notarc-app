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
      className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 text-center sm:px-6 sm:py-24"
    >

      <h2 className="text-3xl font-bold text-white sm:text-4xl">
        Our Training Partners
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
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
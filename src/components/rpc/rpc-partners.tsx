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
      className="scroll-mt-24 border-t border-gray-100 bg-white px-4 py-16 sm:px-6 sm:py-24"
    >

      <div className="mx-auto max-w-3xl text-center">

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          Partners
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Our Training Partners
        </h2>

        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          NOTARC &times; Vayuratha Pvt. Ltd.
        </p>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
          Bringing professional drone education and certified pilot
          training together.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">

          {PARTNERS.map((partner) => (

            <div
              key={partner.name}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left"
            >
              <h3 className="text-base font-bold uppercase tracking-wide text-gray-900">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {partner.role}
              </p>
            </div>

          ))}

        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-gray-500">
          Training is jointly managed by both organisations and
          conducted at the Vayuratha training centre.
        </p>

      </div>

    </section>
  );
}

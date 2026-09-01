import Image from "next/image";
import Link from "next/link";

const clients = [
  {
    name: "COMEDKARES",
    logo: "/clients/Comedkares-Logo-EPS.png",
    href: "https://comedkares.org/",
  },
  {
    name: "SJCIT",
    logo: "/clients/hhhhhhhhhhhhhhhhhhhhhhhhhh (1).png",
    href: "https://sjcit.ac.in/",
  },
  {
    name: "MCE",
    logo: "/clients/Image_1292EDB5_5641_F2C1_41BA_B225C09396B4_en.png",
    href: "https://www.mcehassan.ac.in/home/MERIIISE",
  },
  {
    name: "Inunity",
    logo: "/clients/inunity-logo-white.png",
    href: "https://inunity.in/",
  },
  {
    name: "Poornaprajna",
    logo: "/clients/logo.png",
    href: "https://poornaprajna.ac.in/",
  },
  {
    name: "MERIIISE",
    logo: "/clients/meriiseNewLogo.png",
    href: "https://www.mcehassan.ac.in/home/MERIIISE",
  },
  {
    name: "PESCE",
    logo: "/clients/peslogo.png",
    href: "https://pesce.ac.in/",
  },
  {
    name: "RRCE",
    logo: "/clients/rrce-logo.png",
    href: "https://www.rrce.org/",
  },
  {
    name: "SKIT",
    logo: "/clients/skit logooo (2).png",
    href: "https://www.skit.org.in/",
  },
  {
    name: "Thomas School",
    logo: "/clients/thomassholl.png",
  },
  {
    name: "RNSIT",
    logo: "/clients/RNSIT.png",
    href: "https://www.rnsit.ac.in/",
  },
  {
    name: "KSIT",
    logo: "/clients/KSIT.png",
    href: "https://www.ksit.ac.in/",
  },
];

export default function ClientsSection() {
  return (
    <section className="overflow-hidden bg-grey py-10 text-white sm:py-12 lg:py-20">

      <div className="mb-7 flex items-center justify-center gap-3 sm:mb-10 sm:gap-5">
        <div className="h-px w-10 bg-white/15 sm:w-16 lg:w-24" />
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Trusted By
        </h2>
        <div className="h-px w-10 bg-white/15 sm:w-16 lg:w-24" />
      </div>

      <div className="overflow-hidden">

        <div className="animate-marquee flex w-max items-center gap-8 sm:gap-12 lg:gap-16">

          {[...clients, ...clients].map((client, index) => {

            const logo = (
              <Image
                src={client.logo}
                alt={client.name}
                width={180}
                height={80}
                className="
                  h-9
                  w-auto
                  object-contain
                  transition-all
                  duration-300
                  drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]
                  hover:scale-105
                  hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]
                  hover:grayscale-0
                  sm:h-12
                  lg:h-20
                "
              />
            );

            return client.href ? (
              <Link
                key={index}
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {logo}
              </Link>
            ) : (
              <div key={index}>
                {logo}
              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}
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
    logo: "/clients/inunity-logo-black-png.png",
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
];

export default function ClientsSection() {
  return (
    <section className="overflow-hidden py-20 bg-white">

      <div className="mb-12 flex items-center justify-center gap-5">
        <div className="h-px w-24 bg-blue-600" />
        <h2 className="text-3xl font-bold text-blue-600">
          Happy Clients
        </h2>
        <div className="h-px w-24 bg-blue-600" />
      </div>

      <div className="overflow-hidden">

        <div className="animate-marquee flex w-max items-center gap-16">

          {[...clients, ...clients].map((client, index) => {

            const logo = (
              <Image
                src={client.logo}
                alt={client.name}
                width={180}
                height={80}
                className="h-20 w-auto object-contain grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0"
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
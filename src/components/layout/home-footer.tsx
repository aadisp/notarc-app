import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const services = [
  "Drone Solutions",
  "Tech Workshops & Training",
  "Prototyping & 3D Printing",
  "Web & Digital Solutions",
  "Project Consulting",
  "RC & Robotics Customization",
];

export default function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">

      {/* Ambient background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Main footer content */}

        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-20">

          {/* Brand */}

          <div className="lg:col-span-1">

            <Link
              href="/"
              className="inline-block"
            >
              <Image
                src="/ntrclogo.png"
                alt="NOTARC"
                width={180}
                height={70}
                className="h-auto w-[150px] object-contain"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              Innovating the future with drones, robotics,
              RC solutions, engineering, and practical
              technology education.
            </p>

            <div className="mt-7 flex items-center gap-3">

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  bg-white/[0.04]
                  text-white/60
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  bg-white/[0.04]
                  text-white/60
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  bg-white/[0.04]
                  text-white/60
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <FaYoutube size={18} />
              </a>

            </div>

          </div>

          {/* Explore */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <div className="mt-6 space-y-3">

              <Link
                href="/"
                className="block text-sm text-white/55 transition hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="block text-sm text-white/55 transition hover:translate-x-1 hover:text-white"
              >
                Explore Products
              </Link>

              <Link
                href="/courses"
                className="block text-sm text-white/55 transition hover:translate-x-1 hover:text-white"
              >
                Book a Course
              </Link>

              <Link
                href="/contact-us"
                className="block text-sm text-white/55 transition hover:translate-x-1 hover:text-white"
              >
                Contact Us
              </Link>

              <Link
                href="/cart"
                className="block text-sm text-white/55 transition hover:translate-x-1 hover:text-white"
              >
                Cart
              </Link>

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </h3>

            <div className="mt-6 space-y-3">

              {services.map((service) => (
                <p
                  key={service}
                  className="text-sm leading-6 text-white/55"
                >
                  {service}
                </p>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get In Touch
            </h3>

            <div className="mt-6 space-y-5">

              <a
                href="mailto:info@notarc.in"
                className="group flex items-start gap-3"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-white/50 transition group-hover:text-white"
                />

                <span className="text-sm leading-6 text-white/55 transition group-hover:text-white">
                  info@notarc.in
                </span>
              </a>

              <a
                href="tel:+91XXXXXXXXXX"
                className="group flex items-start gap-3"
              >
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-white/50 transition group-hover:text-white"
                />

                <span className="text-sm leading-6 text-white/55 transition group-hover:text-white">
                  +91 79757 82830
                </span>
              </a>

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-white/50"
                />

                <span className="text-sm leading-6 text-white/55">
                  Bengaluru, Karnataka
                  <br />
                  India
                </span>

              </div>

            </div>

            <Link
              href="/contact-us"
              className="
                mt-7 inline-flex items-center gap-2
                rounded-full
                border border-white/10
                bg-white/[0.06]
                px-5 py-2.5
                text-sm font-medium
                text-white
                transition-all duration-300
                hover:border-white/20
                hover:bg-white/10
                hover:shadow-lg
              "
            >
              Contact Us
              <ArrowUpRight size={16} />
            </Link>

          </div>

        </div>

        {/* Bottom bar */}

        <div className="flex flex-col gap-4 py-7 text-sm text-white/40 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} NOTARC. All rights reserved.
          </p>

          <div className="flex gap-6">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
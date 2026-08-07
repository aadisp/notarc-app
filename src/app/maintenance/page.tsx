import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Under Maintenance",
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900 px-6">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl shadow-2xl">

        <div className="mb-10 flex justify-center">
            <Image
                src="/logo.png"
                alt="NOTARC Logo"
                width={420}
                height={420}
                priority
                className="h-auto w-full max-w-[105px]"
            />
        </div>

        

        <p className="mt-8 text-2xl font-semibold text-white">
          We're Currently Under Maintenance
        </p>

        <p className="mt-6 text-lg leading-8 text-gray-300">
          We're making major improvements to the NOTARC platform,
          including new features, a faster experience,
          and exciting updates.

          <br />
          <br />

          We'll be back online very soon.

          Thank you for your patience.
        </p>

        <div className="mt-12 flex justify-center gap-3">

          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" />

          <div
            className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "0.2s" }}
          />

          <div
            className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "0.4s" }}
          />

        </div>

        <p className="mt-12 text-sm text-gray-500">
          © {new Date().getFullYear()} NOTARC. All rights reserved.
        </p>

      </div>

    </main>
  );
}
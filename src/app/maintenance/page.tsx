import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Under Maintenance",
};

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d0d] px-6">

    {/* Background glow */}
    <div className="absolute inset-0">
        <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/[0.02] blur-3xl" />
    </div>

    <div className="relative w-full max-w-3xl rounded-[36px] border border-white/10 bg-[#141414] px-10 py-16 text-center shadow-[0_0_80px_rgba(255,255,255,0.04)]">

        <div className="mb-10 flex justify-center">
        <Image
            src="/logo.png"
            alt="NOTARC Logo"
            width={420}
            height={420}
            priority
            className="h-auto w-full max-w-[220px] drop-shadow-[0_12px_30px_rgba(255,255,255,0.15)]"
        />
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white">
        Under Maintenance
        </h1>

        <div className="mx-auto mt-6 h-px w-24 bg-white/20" />

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-zinc-400">

        We're building something better.

        <br />
        <br />

        Major upgrades are currently underway to improve the NOTARC
        platform with new features, enhanced performance, and a better
        overall experience.

        <br />
        <br />

        Thank you for your patience. We'll be back online soon.

        </p>

        <div className="mt-12 flex justify-center gap-3">

        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-white" />

        <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-white"
            style={{ animationDelay: "0.2s" }}
        />

        <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-white"
            style={{ animationDelay: "0.4s" }}
        />

        </div>

        <p className="mt-14 text-sm tracking-wider text-zinc-600">
        © {new Date().getFullYear()} NOTARC. All rights reserved.
        </p>

    </div>

    </main>
  );
}
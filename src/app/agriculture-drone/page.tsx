import type { Metadata } from "next";
import SiteLayout from "@/components/layout/site-layout";

export const metadata: Metadata = {
  title: "Agriculture Drone — Notarc",
};

export default function AgricultureDronePage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-32 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Agriculture Drone
        </h1>
        <p className="mt-3 text-gray-500">
          This page is under construction.
        </p>
      </section>
    </SiteLayout>
  );
}

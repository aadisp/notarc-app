"use client";

import { useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import SiteLayout from "@/components/layout/site-layout";

export default function EdpPage() {

  const { user, loading } = useAuth();
  const router = useRouter();

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements also pick up the
  // dark theme variables from globals.css.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  useEffect(() => {

    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div
          className="bg-[#0b0d10] text-white"
          style={{
            "--background": "#0b0d10",
            "--foreground": "#ffffff",
          } as CSSProperties}
        >
          <section className="py-32 text-center text-white/60">
            Loading...
          </section>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">

          <h1 className="text-3xl font-bold sm:text-4xl">
            EDP
          </h1>

          <p className="mt-3 text-white/60">
            This page is under construction. Let&apos;s build it out step by step.
          </p>

        </section>
      </div>
    </SiteLayout>
  );
}
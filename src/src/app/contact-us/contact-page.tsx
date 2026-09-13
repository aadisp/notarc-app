"use client";

import { useEffect, type CSSProperties } from "react";
import SiteLayout from "@/components/layout/site-layout";

import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import ContactMap from "@/components/contact/contact-map";
import FAQ from "@/components/contact/faq";

export default function ContactPage() {

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

    return (
        <SiteLayout>
            <div
                className="bg-[#0b0d10] text-white"
                style={{
                    "--background": "#0b0d10",
                    "--foreground": "#ffffff",
                } as CSSProperties}
            >
                <main className="mx-auto max-w-[1400px] px-6 pt-12 pb-24">

                    <section className="mb-20 text-center">

                        <span className="rounded-full border px-4 py-2 text-sm font-medium">
                            CONTACT NOTARC
                        </span>

                        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
                            Let's Build
                            <br />
                            Something Amazing
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-lg text-white/60">
                            Whether you're looking for drone solutions,
                            robotics training, workshops, engineering
                            consultation, or custom projects, we'd love
                            to hear from you.
                        </p>

                    </section>

                    <section className="grid gap-12 lg:grid-cols-[420px_1fr]">

                        <ContactInfo />

                        <ContactForm />

                    </section>

                    <ContactMap />

                    <FAQ />

                </main>
            </div>
        </SiteLayout>
    );
}
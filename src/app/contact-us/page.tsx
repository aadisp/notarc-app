import SiteLayout from "@/components/layout/site-layout";

import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import ContactMap from "@/components/contact/contact-map";
import FAQ from "@/components/contact/faq";

export default function ContactPage() {
    return (
        <SiteLayout>
            <main className="mx-auto max-w-7xl px-6 py-24">

                <section className="mb-20 text-center">

                    <span className="rounded-full border px-4 py-2 text-sm font-medium">
                        CONTACT NOTARC
                    </span>

                    <h1 className="mt-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
                        Let's Build
                        <br />
                        Something Amazing
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
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
        </SiteLayout>
    );
}
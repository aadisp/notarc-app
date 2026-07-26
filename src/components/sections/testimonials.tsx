"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Testimonials() {

    useEffect(() => {

        const existingScript = document.querySelector(
            'script[src="https://static.elfsight.com/platform/platform.js"]'
        );

        if (!existingScript) {

            const script = document.createElement("script");

            script.src =
                "https://static.elfsight.com/platform/platform.js";

            script.defer = true;

            document.body.appendChild(script);

        }

    }, []);

    return (

        <section className="mx-auto max-w-7xl px-6 py-24">

            <div className="text-center">

                <p className="font-semibold uppercase tracking-widest text-primary">
                    Testimonials
                </p>

                <h2 className="mt-3 text-5xl font-bold">
                    What Our Clients Say
                </h2>

                <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
                    Read genuine experiences from our students, customers and
                    partners on Google.
                </p>

            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

            

            </div>

            <div className="mt-16">

                <div
                    className="elfsight-app-5a18d460-a175-4846-9b51-70f9f96328ed"
                    data-elfsight-app-lazy
                />

            </div>

        </section>

    );

}
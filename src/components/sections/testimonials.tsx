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

        <section className="mx-auto max-w-7xl px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-24">

            <div className="text-center">

                <p className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                    Testimonials
                </p>

                <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
                    What Our Clients Say
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 italic sm:mt-6 sm:text-base sm:leading-7">
                    Read genuine experiences from our students, customers and
                    partners on Google.
                </p>

            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

            

            </div>

            <div className="mt-6 sm:mt-10">

                <div
                    className="elfsight-app-5a18d460-a175-4846-9b51-70f9f96328ed"
                    data-elfsight-app-lazy
                />

            </div>

        </section>

    );

}
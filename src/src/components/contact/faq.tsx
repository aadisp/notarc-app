const faqs = [
    {
        question: "Do you conduct drone workshops for colleges?",
        answer:
            "Yes. We organize workshops, bootcamps, and hands-on training programs for schools, colleges, and organizations.",
    },
    {
        question: "Can you build custom drone solutions?",
        answer:
            "Absolutely. We design and develop custom drone and robotics solutions based on your requirements.",
    },
    {
        question: "Do you provide technical consultation?",
        answer:
            "Yes. We assist with product development, prototyping, research projects, and engineering consultation.",
    },
    {
        question: "How soon will I receive a reply?",
        answer:
            "We aim to respond to all enquiries within one business day.",
    },
];

export default function FAQ() {
    return (
        <section className="mt-24">

            <div className="mb-10">

                <h2 className="text-3xl font-bold">
                    Frequently Asked Questions
                </h2>

            </div>

            <div className="space-y-5">

                {faqs.map((faq) => (

                    <div
                        key={faq.question}
                        className="rounded-2xl border p-6"
                    >

                        <h3 className="text-lg font-semibold">
                            {faq.question}
                        </h3>

                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </p>

                    </div>

                ))}

            </div>

        </section>
    );
}
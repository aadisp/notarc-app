export default function ContactMap() {
    return (
        <section className="mt-24">

            <div className="mb-8">

                <h2 className="text-3xl font-bold">
                    Visit Our Office
                </h2>

                <p className="mt-3 text-muted-foreground">
                    Meet our team, explore our lab, and discuss your
                    project in person.
                </p>

            </div>

            <div className="overflow-hidden rounded-3xl border">

                <iframe
                    src="https://www.google.com/maps?q=57, Chimney Hills Bangalore Hesaraghatta Main Road, Post, Chikkabanavara, Bengaluru, Karnataka 560090&output=embed"
                    width="100%"
                    height="450"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />

            </div>

        </section>
    );
}
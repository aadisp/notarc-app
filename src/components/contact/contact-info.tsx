import {
    Clock3,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

export default function ContactInfo() {
    return (
        <div className="space-y-6">

            <div>

                <h2 className="text-3xl font-bold">
                    Get in Touch
                </h2>

                <p className="mt-3 text-muted-foreground leading-relaxed">
                    Have questions about our products, workshops,
                    drone services, or custom engineering solutions?
                    Reach out and our team will get back to you as
                    soon as possible.
                </p>

            </div>

            <div className="rounded-2xl border p-6">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Address
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            57, Chimney Hills Bangalore Hesaraghatta Main Road, Post, Chikkabanavara, Bengaluru, Karnataka 560090
                        </p>
                    </div>

                </div>

            </div>

            <div className="rounded-2xl border p-6">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <Phone className="h-6 w-6 text-primary" />
                    </div>

                    <div>

                        <h3 className="font-semibold">
                            Phone
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            +91 79757 82830
                        </p>

                    </div>

                </div>

            </div>

            <div className="rounded-2xl border p-6">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>

                    <div>

                        <h3 className="font-semibold">
                            Email
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Info@notarc.in
                        </p>

                    </div>

                </div>

            </div>

            <div className="rounded-2xl border p-6">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-primary/10 p-3">
                        <Clock3 className="h-6 w-6 text-primary" />
                    </div>

                    <div>

                        <h3 className="font-semibold">
                            Working Hours
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Monday – Saturday
                            <br />
                            9:00 AM – 6:00 PM
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}
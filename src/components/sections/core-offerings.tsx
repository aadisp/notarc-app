import {
    Plane,
    GraduationCap,
    Boxes,
    Code2,
    Presentation,
    Wrench,
} from "lucide-react";

const services = [
    {
        title: "Drone Solutions",
        description:
            "Aerial surveying, inspections, banner hoisting, creative drone applications, and industry-focused drone services.",
        icon: Plane,
    },
    {
        title: "Tech Workshops & Training",
        description:
            "Hands-on workshops in drones, robotics, RC cars, 3D printing, and programming for all age groups.",
        icon: GraduationCap,
    },
    {
        title: "Prototyping & 3D Printing",
        description:
            "Rapid prototyping and precision 3D printing services for education, research, and product development.",
        icon: Boxes,
    },
    {
        title: "Web & Digital Solutions",
        description:
            "Modern websites, web applications, UI/UX design, and digital platforms tailored to your needs.",
        icon: Code2,
    },
    {
        title: "Project Consulting",
        description:
            "Expert guidance for drone, robotics, engineering, and technology projects from concept to completion.",
        icon: Presentation,
    },
    {
        title: "RC & Robotics Customization",
        description:
            "Custom RC vehicles, robotics systems, upgrades, repairs, and specialized educational builds.",
        icon: Wrench,
    },
];

export default function CoreOfferings() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24">

            <div className="mb-16 text-center">

                <p className="text-primary font-semibold uppercase tracking-wider">
                    Our Services
                </p>

                <h2 className="mt-3 text-5xl font-bold">
                    Explore Our Core Offerings
                </h2>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                {services.map((service) => {

                    const Icon = service.icon;

                    return (

                        <div
                            key={service.title}
                            className="rounded-3xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                        >

                            <Icon
                                className="mb-8 text-primary"
                                size={54}
                            />

                            <h3 className="text-3xl font-bold">
                                {service.title}
                            </h3>

                            <p className="mt-5 text-lg leading-8 text-muted-foreground">
                                {service.description}
                            </p>

                        </div>

                    );

                })}

            </div>

        </section>
    );
}
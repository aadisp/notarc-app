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
        image: "/services/drone-solutions.png",
    },
    {
        title: "Tech Workshops & Training",
        description:
            "Hands-on workshops in drones, robotics, RC cars, 3D printing, and programming for all age groups.",
        icon: GraduationCap,
        image: "/services/workshops.png",
    },
    {
        title: "Prototyping & 3D Printing",
        description:
            "Rapid prototyping and precision 3D printing services for education, research, and product development.",
        icon: Boxes,
        image: "/services/3d-printing.png",
    },
    {
        title: "Web & Digital Solutions",
        description:
            "Modern websites, web applications, UI/UX design, and digital platforms tailored to your needs.",
        icon: Code2,
        image: "/services/web-solutions.png",
    },
    {
        title: "Project Consulting",
        description:
            "Expert guidance for drone, robotics, engineering, and technology projects from concept to completion.",
        icon: Presentation,
        image: "/services/consulting.png",
    },
    {
        title: "RC & Robotics Customization",
        description:
            "Custom RC vehicles, robotics systems, upgrades, repairs, and specialized educational builds.",
        icon: Wrench,
        image: "/services/robotics.png",
    },
];

export default function CoreOfferings() {
    return (
        <section className="mx-auto max-w-7xl px-6 pt-6 pb-20 text-white lg:pt-1 lg:pb-24">

            <div className="mb-12 text-center">

                <p className="font-semibold uppercase tracking-wider text-white">
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
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-3xl
                                border
                                border-white/10
                                p-7
                                shadow-sm
                                transition-all
                                duration-500
                                hover:-translate-y-2
                                hover:border-white/20
                                hover:shadow-2xl
                                lg:p-8
                            "
                        >

                            {/* Background image */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    z-0
                                    bg-cover
                                    bg-center
                                    scale-100
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-105
                                "
                                style={{
                                    backgroundImage: `url(${service.image})`,
                                }}
                            />

                            {/* Permanent dark overlay */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    z-10
                                    bg-black/55
                                    transition-all
                                    duration-500
                                    group-hover:bg-black/65
                                "
                            />

                            {/* Card content */}

                            <div className="relative z-20">

                                <Icon
                                    className="
                                        mb-6
                                        text-white
                                        drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]
                                        transition-all
                                        duration-500
                                        group-hover:scale-105
                                    "
                                    size={48}
                                />

                                <h3
                                    className="
                                        text-3xl
                                        font-bold
                                        text-white
                                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                                    "
                                >
                                    {service.title}
                                </h3>

                                <p
                                    className="
                                        mt-4
                                        text-base
                                        leading-7
                                        text-white/85
                                        drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
                                        lg:text-lg
                                        lg:leading-8
                                    "
                                >
                                    {service.description}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>
    );
}
"use client";

import { Clock3, GraduationCap, CheckCircle2, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EnrolledCourseCardProps {
    slug: string;
    name: string;
    level?: string;
    duration?: string;
    description?: string;
    imageUrl?: string;
    disenrollmentPending?: boolean;
    onRequestDisenrollment?: () => void;
}

export default function EnrolledCourseCard({
    slug,
    name,
    level,
    duration,
    description,
    imageUrl,
    disenrollmentPending,
    onRequestDisenrollment,
}: EnrolledCourseCardProps) {

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20">

            <Link href={`/courses/${slug}`}>

                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02]">

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-white/30">
                            <GraduationCap className="h-14 w-14" />
                        </div>
                    )}

                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Enrolled
                    </span>

                </div>

            </Link>

            <div className="flex flex-1 flex-col p-6">

                <div className="space-y-3">

                    {level && (
                        <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {level}
                        </span>
                    )}

                    <Link href={`/courses/${slug}`}>
                        <h3 className="line-clamp-2 text-xl font-bold tracking-tight transition hover:text-emerald-400">
                            {name}
                        </h3>
                    </Link>

                    {description && (
                        <p className="line-clamp-3 text-sm leading-6 text-white/60">
                            {description}
                        </p>
                    )}

                </div>

                <div className="mt-auto pt-6">

                    {duration && (
                        <div className="mb-5 flex items-center gap-2 text-white/60">
                            <Clock3 className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {duration}
                            </span>
                        </div>
                    )}

                    {disenrollmentPending ? (
                        <Button
                            disabled
                            variant="outline"
                            className="h-11 w-full font-semibold"
                        >
                            <Hourglass className="h-4 w-4" />
                            Disenrollment Requested
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="h-11 w-full font-semibold"
                            onClick={onRequestDisenrollment}
                        >
                            Request Disenrollment
                        </Button>
                    )}

                </div>

            </div>

        </div>
    );
}
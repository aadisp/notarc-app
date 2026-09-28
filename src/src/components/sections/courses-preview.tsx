"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import CourseCard from "@/components/courses/course-card";
import { useCourses } from "@/hooks/use-courses";

export default function CoursesPreview() {
    const {
        courses,
        loading,
        error,
    } = useCourses();

    const previewCourses = courses.slice(0, 3);

    return (
        <section className="mx-auto max-w-7xl px-6 py-40">
            <div className="mb-12">
                <h2 className="text-4xl font-bold">
                    Drone Bootcamps & Courses
                </h2>

                <p className="mt-4 text-muted-foreground">
                    Learn drone building, electronics, programming, robotics, and emerging technologies from industry experts.
                </p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    Loading courses...
                </div>
            ) : error ? (
                <div className="py-20 text-center text-red-500">
                    {error}
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {previewCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            firestoreId={course.id}
                            slug={course.slug}
                            name={course.name}
                            level={course.level}
                            duration={course.duration}
                            description={course.description}
                            imageUrl={course.imageUrl}
                        />
                    ))}
                </div>
            )}

            <div className="mt-10">
                <Link href="/courses">
                    <Button>
                        Browse Courses
                    </Button>
                </Link>
            </div>
        </section>
    );
}
"use client";

import { useCourses } from "@/hooks/use-courses";
import CourseGrid from "@/components/courses/course-grid";
import SiteLayout from "@/components/layout/site-layout";

export default function CoursesPage() {
  const {
    courses,
    loading,
    error,
} = useCourses();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-24">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight lg:text-6xl">
          Explore, Experience, and Expand
        </h1>

        <p className="mt-6 max-w-4xl text-lg text-muted-foreground">
          Explore our drone, robotics, and technology courses. Gain hands on experience with real-time workshops, and open a door of oppurtunities by expanding you knowledge about drones and the mechanics behind its magic.
        </p>

        <div className="mt-20">
            <CourseGrid
                courses={courses}
            />
        </div>
      </section>
    </SiteLayout>
  );
}
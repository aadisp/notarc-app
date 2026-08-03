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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="mb-4 text-5xl font-bold">
          Courses
        </h1>

        <p className="text-muted-foreground">
          Explore our drone, robotics, and technology courses.
        </p>

        <div className="mt-12">
            <CourseGrid
                courses={courses}
            />
        </div>
      </section>
    </SiteLayout>
  );
}
"use client";

import { useCourses } from "@/hooks/use-courses";
import { useEffect, type CSSProperties } from "react";
import CourseGrid from "@/components/courses/course-grid";
import SiteLayout from "@/components/layout/site-layout";

export default function CoursesPage() {
  const {
    courses,
} = useCourses();

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements also pick up the
  // dark theme variables from globals.css.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-24">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
            Explore, Experience, and Expand
          </h1>

          <p className="mt-6 max-w-4xl text-lg text-white/60">
            Explore our drone, robotics, and technology courses. Gain hands on experience with real-time workshops, and open a door of oppurtunities by expanding you knowledge about drones and the mechanics behind its magic.
          </p>

          <div className="mt-20">
              <CourseGrid
                  courses={courses}
              />
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
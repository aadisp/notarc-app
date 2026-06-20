import { Button } from "@/components/ui/button";
import CourseCard from "@/components/cards/course-card";

export default function CoursesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-40">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
          Drone Bootcamps & Courses
        </h2>

        <p className="mt-4 text-muted-foreground">
          Learn drone building, electronics, programming, and more.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border p-8">
          <CourseCard
            title="Drone Building Bootcamp"
            duration="2 Weeks"
            level="Beginner"
          />
        </div>

        <div className="rounded-xl border p-8">
          <CourseCard
            title="FPV Drone Workshop"
            duration="3 Days"
            level="Intermediate"
          />
        </div>

        <div className="rounded-xl border p-8">
          <CourseCard
            title="Drone Programming"
            duration="4 Weeks"
            level="Advanced"
          />
        </div>
      </div>

      <div className="mt-10">
        <Button>
          Browse Courses
        </Button>
      </div>
    </section>
  );
}
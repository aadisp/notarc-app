"use client";

import CourseCard from "@/components/courses/course-card";

import { Course } from "@/types/course";

interface CourseGridProps {
    courses: Course[];
}

export default function CourseGrid({
    courses,
}: CourseGridProps) {
  

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {courses.map((course) => (
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
  );
}
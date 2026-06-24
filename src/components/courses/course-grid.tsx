"use client";

import CourseCard from "@/components/courses/course-card";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  description: string;
  imageUrl?: string;
  slug: string;
}

export default function CourseGrid() {
  const [courses, setCourses] =
    useState<Course[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const snapshot =
        await getDocs(
          collection(db, "courses")
        );

      const courseList =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

      setCourses(courseList);
    }

    loadCourses();
  }, []);

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
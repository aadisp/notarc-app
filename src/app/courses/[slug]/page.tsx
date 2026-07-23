"use client";

import CourseGrid from "@/components/courses/course-grid";
import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Clock3, GraduationCap } from "lucide-react";

import { Course } from "@/types/course";

export default function CoursePage() {

  const params = useParams();

  const slug =
    params.slug as string;

  const [course, setCourse] =
    useState<Course | null>(null);
  
  const [allCourses, setAllCourses] =
    useState<Course[]>([]);

  const [isEnrolled, setIsEnrolled] =
    useState(false);

  useEffect(() => {
    async function loadCourse() {

      const snapshot =
        await getDocs(
          collection(db, "courses")
        );

      const courses =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

      setAllCourses(courses);
      

      const foundCourse =
        courses.find(
          (item) =>
            item.slug === slug
        );

      if (!foundCourse) {
        notFound();
      }

      setCourse(foundCourse);

      const user = auth.currentUser;

      if (user) {

        const enrollmentQuery =
          query(
            collection(
              db,
              "enrollments"
            ),
            where(
              "userId",
              "==",
              user.uid
            ),
            where(
              "courseId",
              "==",
              foundCourse.id
            )
          );

        const enrollmentSnapshot =
          await getDocs(
            enrollmentQuery
          );

        if (
          !enrollmentSnapshot.empty
        ) {
          setIsEnrolled(true);
        }
      }
    }

    loadCourse();
  }, [slug]);

  const relatedCourses =
    allCourses
        .filter(
            (item) => item.id !== course?.id
        )
        .slice(0, 3);

  if (!course) {
    return (
      <SiteLayout>
        <section className="p-10">
          <div className="py-24 text-center text-muted-foreground">
              Loading course...
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          <div>

            <div className="mb-6 flex flex-wrap gap-3">

              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Level: {course.level}
              </span>

              <span className="rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground">
                {course.duration}
              </span>

            </div>

            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
              {course.name}
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              {course.description}
            </p>

            {isEnrolled ? (

              <Button
                disabled
                className="mt-10 h-12 px-8"
              >
                ✓ Already Enrolled
              </Button>

            ) : (

              <Button
                className="mt-10 h-12 px-8"
                onClick={async () => {

                  const user = auth.currentUser;

                  if (!user) {
                    toast.error("Please log in first.");
                    return;
                  }

                  try {

                    await addDoc(
                      collection(db, "enrollments"),
                      {
                        userId: user.uid,
                        userEmail: user.email,
                        courseId: course.id,
                        courseName: course.name,
                        courseSlug: course.slug,
                        enrolledAt: new Date(),
                      }
                    );

                    setIsEnrolled(true);

                    toast.success("Successfully enrolled!");

                  } catch (error) {
                    console.error(error);
                  }

                }}
              >
                Enroll Now
              </Button>

            )}

          </div>

          <div>

            {course.imageUrl ? (

              <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-muted to-muted/40 shadow-xl">

                <img
                  src={course.imageUrl}
                  alt={course.name}
                  className="h-full w-full object-cover"
                />

              </div>

            ) : (

              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border bg-muted">

                <div className="text-center text-muted-foreground">
                  <GraduationCap className="mx-auto mb-4 h-14 w-14" />
                  <p>No Image Available</p>
              </div>

              </div>

            )}

          </div>

        </div>

      <div className="mt-24 border-t pt-16">

        <div className="max-w-3xl">

          <span className="rounded-full border px-4 py-2 text-sm font-medium">
            ABOUT
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight">
            About This Course
          </h2>

          <p className="mt-8 text-lg leading-8 text-muted-foreground">
            {course.description}
          </p>

        </div>

      </div>

      <div className="mt-24 border-t pt-16">

        <span className="rounded-full border px-4 py-2 text-sm font-medium">
          DETAILS
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight">
          Course Information
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Course Level
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {course.level}
            </h3>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Duration
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {course.duration}
            </h3>
          </div>

        </div>

      </div>

      {relatedCourses.length > 0 && (

        <div className="mt-24 border-t pt-16">

          <span className="rounded-full border px-4 py-2 text-sm font-medium">
            MORE COURSES
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight">
            Continue Learning
          </h2>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore more courses from NOTARC.
          </p>

          <div className="mt-12">

            <CourseGrid
              courses={relatedCourses}
            />

          </div>

        </div>

      )}
              
      </section>
    </SiteLayout>
  );
}
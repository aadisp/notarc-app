"use client";

import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
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

interface Course {
  id: string;
  name: string;
  slug: string;
  level: string;
  duration: string;
  description: string;
  imageUrl?: string;
}

export default function CoursePage() {

  const params = useParams();

  const slug =
    params.slug as string;

  const [course, setCourse] =
    useState<Course | null>(null);
  
  const [isEnrolled, setIsEnrolled] =
    useState(false);

  const getCurrentUser = () =>
    auth.currentUser;
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

  if (!course) {
    return (
      <SiteLayout>
        <section className="p-10">
          Loading...
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-24">

        {course.imageUrl && (
          <img
            src={course.imageUrl}
            alt={course.name}
            className="
              mb-8
              h-96
              w-full
              rounded-xl
              object-cover
            "
          />
        )}

        <h1 className="mb-4 text-5xl font-bold">
          {course.name}
        </h1>

        <p className="mb-2">
          Level: {course.level}
        </p>

        <p className="mb-8">
          Duration: {course.duration}
        </p>

        <p className="text-lg">
          {course.description}
        </p>

        {isEnrolled ? (

          <Button
            disabled
            className="mt-8"
          >
            Already Enrolled
          </Button>

        ) : (

          <Button
            className="mt-8"
            onClick={async () => {

              const user =
                getCurrentUser();

              if (!user) {
                alert(
                  "Please login first"
                );
                return;
              }

              try {

                await addDoc(
                  collection(
                    db,
                    "enrollments"
                  ),
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

                alert(
                  "Enrollment successful"
                );

              } catch (error) {
                console.error(error);
              }
            }}
          >
            Enroll Now
          </Button>

        )}
      </section>
    </SiteLayout>
  );
}
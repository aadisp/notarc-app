"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useEffect, useState } from "react";

import { auth, db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  userEmail: string;
}

export default function MyCoursesPage() {

  const [enrollments,
    setEnrollments] =
    useState<Enrollment[]>([]);

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {

          if (!user) return;

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
              )
            );

          const snapshot =
            await getDocs(
              enrollmentQuery
            );

          console.log(
            "Enrollment count:",
            snapshot.size
          );

          const enrollmentList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Enrollment[];

          console.log(
            enrollmentList
          );

          setEnrollments(
            enrollmentList
          );
        }
      );

    return () => unsubscribe();

  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-8 text-5xl font-bold">
          My Courses
        </h1>

        <div className="grid gap-6">

          {enrollments.map(
            (enrollment) => (

            <div
              key={enrollment.id}
              className="
                rounded-xl
                border
                p-6
              "
            >

              <h2 className="text-2xl font-bold">
                {enrollment.courseName}
              </h2>

              <p>
                {enrollment.userEmail}
              </p>

            </div>

          ))}

        </div>

      </section>
    </SiteLayout>
  );
}
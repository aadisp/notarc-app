"use client";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useState } from "react";

import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

interface Enrollment {
  id: string;
  userEmail: string;
  courseName: string;
  enrolledAt?: {
    seconds: number;
  };
}

export default function AdminEnrollmentsPage() {

  const [enrollments,
    setEnrollments] =
    useState<Enrollment[]>([]);

  const role = useUserRole();

  useEffect(() => {

    async function loadEnrollments() {

      const snapshot =
        await getDocs(
          collection(
            db,
            "enrollments"
          )
        );

      const enrollmentList =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Enrollment[];

      setEnrollments(
        enrollmentList
      );
    }

    loadEnrollments();

  }, []);

  if (role !== "admin") {
    return (
        <SiteLayout>
        <section className="p-10">
            Access Denied
        </section>
        </SiteLayout>
    );
    }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-8 text-5xl font-bold">
          Course Enrollments
        </h1>

        <div className="space-y-4">

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

              <h2 className="text-xl font-bold">
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
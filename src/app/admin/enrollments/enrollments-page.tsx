"use client";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useState } from "react";
import EnrollmentStats from "@/components/admin/enrollments/enrollment-stats";
import EnrollmentSearch from "@/components/admin/enrollments/enrollment-search";
import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
import AdminNav from "@/components/admin/admin-nav";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import type { Enrollment } from "@/types/enrollment";

export default function AdminEnrollmentsPage() {

  const [enrollments, setEnrollments] =
      useState<Enrollment[]>([]);

  const [search, setSearch] =
      useState("");

  const totalEnrollments = enrollments.length;

  const uniqueStudents = new Set(
      enrollments.map((e) => e.userId)
  ).size;

  const uniqueCourses = new Set(
      enrollments.map((e) => e.courseId)
  ).size;

  const filteredEnrollments = enrollments.filter((enrollment) => {
      const text = search.toLowerCase();

      return (
          enrollment.courseName.toLowerCase().includes(text) ||
          enrollment.userEmail.toLowerCase().includes(text) ||
          enrollment.courseSlug.toLowerCase().includes(text)
      );
  });

  const role = useUserRole();

  useEffect(() => {
      const q = query(
          collection(db, "enrollments"),
          orderBy("enrolledAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
          const enrollmentList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as Enrollment[];

          setEnrollments(enrollmentList);
      });

      return () => unsubscribe();
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

        <AdminNav />

        <EnrollmentStats
          totalEnrollments={totalEnrollments}
          uniqueStudents={uniqueStudents}
          uniqueCourses={uniqueCourses}
        />

        <div className="mb-8">
          <EnrollmentSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="space-y-4">

          {filteredEnrollments.length === 0 ? (

            <div
              className="
                rounded-2xl
                border
                bg-white
                p-16
                text-center
                shadow-sm
              "
            >

              <h2 className="text-2xl font-semibold">
                No enrollments found
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search.
              </p>

            </div>

          ) : (

            filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="
                  rounded-2xl
                  border
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  hover:shadow-md
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {enrollment.courseName}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {enrollment.userEmail}
                    </p>

                    <p className="text-sm text-gray-500">
                      User ID: {enrollment.userId.slice(0, 10)}...
                    </p>

                    <p className="text-sm text-gray-500">
                      Slug: {enrollment.courseSlug}
                    </p>

                  </div>

                  <div className="text-right">

                    <span
                      className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-green-700
                      "
                    >
                      Enrolled
                    </span>

                    <p className="mt-3 text-sm text-gray-500">
                      {enrollment.enrolledAt.toDate().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                </div>

              </div>
            ))

          )}

        </div>

      </section>
    </SiteLayout>
  );
}
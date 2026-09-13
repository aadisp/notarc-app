"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { auth, db } from "@/firebase/firebase";
import { useCourses } from "@/hooks/use-courses";
import EnrolledCourseCard from "@/components/courses/enrolled-course-card";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import { toast } from "sonner";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  courseSlug: string;
  userEmail: string;
}

export default function MyCoursesPage() {

  const [enrollments,
    setEnrollments] =
    useState<Enrollment[]>([]);

  const [pendingDisenrollments,
    setPendingDisenrollments] =
    useState<Set<string>>(new Set());

  const [confirmingEnrollment,
    setConfirmingEnrollment] =
    useState<Enrollment | null>(null);

  const { courses } = useCourses();

  const coursesById = useMemo(() => {
    return new Map(
      courses.map((course) => [course.id, course])
    );
  }, [courses]);

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

          const disenrollmentQuery =
            query(
              collection(
                db,
                "disenrollmentRequests"
              ),
              where(
                "userId",
                "==",
                user.uid
              ),
              where(
                "status",
                "==",
                "pending"
              )
            );

          const disenrollmentSnapshot =
            await getDocs(
              disenrollmentQuery
            );

          const pendingCourseIds =
            disenrollmentSnapshot.docs.map(
              (doc) => doc.data().courseId as string
            );

          setPendingDisenrollments(
            new Set(pendingCourseIds)
          );
        }
      );

    return () => unsubscribe();

  }, []);

  async function handleRequestDisenrollment(
    enrollment: Enrollment
  ) {

    const user = auth.currentUser;

    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    try {

      await addDoc(
        collection(db, "disenrollmentRequests"),
        {
          userId: user.uid,
          userEmail: user.email,
          enrollmentId: enrollment.id,
          courseId: enrollment.courseId,
          courseName: enrollment.courseName,
          courseSlug: enrollment.courseSlug,
          status: "pending",
          requestedAt: serverTimestamp(),
        }
      );

      setPendingDisenrollments(
        (previous) =>
          new Set(previous).add(enrollment.courseId)
      );

      toast.success("Disenrollment request submitted.");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

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
        <section className="mx-auto max-w-7xl px-6 py-24">

          <h1 className="mb-8 text-5xl font-bold">
            My Courses
          </h1>

          {enrollments.length === 0 ? (
            <div className="rounded-xl border p-6 text-white/60">
              You haven't enrolled in any courses yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {enrollments.map(
                (enrollment) => {

                  const course = coursesById.get(enrollment.courseId);

                  return (
                    <EnrolledCourseCard
                      key={enrollment.id}
                      slug={enrollment.courseSlug}
                      name={enrollment.courseName}
                      level={course?.level}
                      duration={course?.duration}
                      description={course?.description}
                      imageUrl={course?.imageUrl}
                      disenrollmentPending={pendingDisenrollments.has(enrollment.courseId)}
                      onRequestDisenrollment={() => setConfirmingEnrollment(enrollment)}
                    />
                  );

              })}

            </div>
          )}

        </section>
      </div>

      <ConfirmDialog
        open={confirmingEnrollment !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingEnrollment(null);
        }}
        onConfirm={() => {
          if (confirmingEnrollment) {
            handleRequestDisenrollment(confirmingEnrollment);
          }
        }}
        title="Request Disenrollment"
        description={`Request disenrollment from "${confirmingEnrollment?.courseName ?? ""}"? An admin will review your request.`}
        confirmLabel="Request Disenrollment"
        confirmVariant="destructive"
      />
    </SiteLayout>
  );
}
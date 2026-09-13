"use client";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useMemo, useState } from "react";
import EnrollmentStats from "@/components/admin/enrollments/enrollment-stats";
import EnrollmentSearch from "@/components/admin/enrollments/enrollment-search";
import SiteLayout from "@/components/layout/site-layout";
import { db } from "@/firebase/firebase";
import AdminNav from "@/components/admin/admin-nav";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/confirm-dialog";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import type { Enrollment } from "@/types/enrollment";
import type { DisenrollmentRequest } from "@/types/disenrollment-request";

export default function AdminEnrollmentsPage() {

  const [enrollments, setEnrollments] =
      useState<Enrollment[]>([]);

  const [disenrollmentRequests, setDisenrollmentRequests] =
      useState<DisenrollmentRequest[]>([]);

  const [search, setSearch] =
      useState("");

  const [confirmingAction, setConfirmingAction] =
      useState<{
        type: "approve" | "deny";
        request: DisenrollmentRequest;
      } | null>(null);

  const totalEnrollments = enrollments.length;

  const uniqueStudents = new Set(
      enrollments.map((e) => e.userId)
  ).size;

  const uniqueCourses = new Set(
      enrollments.map((e) => e.courseId)
  ).size;

  const pendingRequestsByEnrollmentId = useMemo(() => {
      return new Map(
          disenrollmentRequests.map(
              (request) => [request.enrollmentId, request]
          )
      );
  }, [disenrollmentRequests]);

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

  useEffect(() => {
      const q = query(
          collection(db, "disenrollmentRequests"),
          where("status", "==", "pending")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
          const requestList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as DisenrollmentRequest[];

          setDisenrollmentRequests(requestList);
      });

      return () => unsubscribe();
  }, []);

  async function handleApproveDisenrollment(
      request: DisenrollmentRequest
  ) {

      try {

          await deleteDoc(
              doc(db, "enrollments", request.enrollmentId)
          );

          await updateDoc(
              doc(db, "disenrollmentRequests", request.id),
              {
                  status: "approved",
                  reviewedAt: serverTimestamp(),
              }
          );

          toast.success("Disenrollment approved.");

      } catch (error) {
          console.error(error);
          toast.error("Something went wrong. Please try again.");
      }
  }

  async function handleDenyDisenrollment(
      request: DisenrollmentRequest
  ) {

      try {

          await updateDoc(
              doc(db, "disenrollmentRequests", request.id),
              {
                  status: "denied",
                  reviewedAt: serverTimestamp(),
              }
          );

          toast.success("Disenrollment request denied.");

      } catch (error) {
          console.error(error);
          toast.error("Something went wrong. Please try again.");
      }
  }

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

            filteredEnrollments.map((enrollment) => {

              const disenrollmentRequest =
                  pendingRequestsByEnrollmentId.get(enrollment.id);

              return (
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

                {disenrollmentRequest && (

                  <div
                    className="
                      mt-6
                      flex
                      flex-col
                      gap-4
                      rounded-xl
                      border
                      border-amber-200
                      bg-amber-50
                      p-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div>

                      <span
                        className="
                          rounded-full
                          bg-amber-100
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-amber-800
                        "
                      >
                        Disenrollment Requested
                      </span>

                      <p className="mt-2 text-sm text-amber-900">
                        Requested{" "}
                        {disenrollmentRequest.requestedAt
                          ?.toDate()
                          .toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                      </p>

                    </div>

                    <div className="flex gap-2">

                      <Button
                        variant="outline"
                        onClick={() =>
                          setConfirmingAction({
                            type: "deny",
                            request: disenrollmentRequest,
                          })
                        }
                      >
                        Deny
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() =>
                          setConfirmingAction({
                            type: "approve",
                            request: disenrollmentRequest,
                          })
                        }
                      >
                        Approve Disenrollment
                      </Button>

                    </div>

                  </div>

                )}

              </div>
              );
            })

          )}

        </div>

      </section>

      <ConfirmDialog
        open={confirmingAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingAction(null);
        }}
        onConfirm={() => {
          if (!confirmingAction) return;
          if (confirmingAction.type === "approve") {
            handleApproveDisenrollment(confirmingAction.request);
          } else {
            handleDenyDisenrollment(confirmingAction.request);
          }
        }}
        title={
          confirmingAction?.type === "approve"
            ? "Approve Disenrollment"
            : "Deny Disenrollment Request"
        }
        description={
          confirmingAction?.type === "approve"
            ? `Approve disenrollment for ${confirmingAction?.request.userEmail} from "${confirmingAction?.request.courseName}"?`
            : `Deny disenrollment request from ${confirmingAction?.request.userEmail} for "${confirmingAction?.request.courseName}"? Their enrollment will stay active.`
        }
        warning={
          confirmingAction?.type === "approve"
            ? "This will remove their enrollment. This action cannot be undone."
            : undefined
        }
        confirmLabel={
          confirmingAction?.type === "approve" ? "Approve" : "Deny"
        }
        confirmVariant={
          confirmingAction?.type === "approve" ? "destructive" : "default"
        }
      />
    </SiteLayout>
  );
}
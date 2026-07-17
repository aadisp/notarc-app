"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Course } from "@/types/course";

interface ViewCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

export default function ViewCourseDialog({
  open,
  onOpenChange,
  course,
}: ViewCourseDialogProps) {

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="
          max-w-3xl
        "
      >

        <DialogHeader>

          <DialogTitle>
            Course Details
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-8">

          {course.imageUrl ? (

            <img
              src={course.imageUrl}
              alt={course.name}
              className="
                h-72
                w-full
                rounded-2xl
                object-cover
              "
            />

          ) : (

            <div
              className="
                flex
                h-72
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
              "
            >
              No Image
            </div>

          )}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="font-semibold">
                {course.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Level
              </p>

              <p className="font-semibold">
                {course.level}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Duration
              </p>

              <p className="font-semibold">
                {course.duration}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Slug
              </p>

              <p className="font-semibold">
                {course.slug}
              </p>
            </div>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Description
            </p>

            <p className="mt-2 leading-7">
              {course.description || "No description."}
            </p>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}
"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import EditCourseDialog from "./edit-course-dialog";
import DeleteCourseDialog from "./delete-course-dialog";
import ViewCourseDialog from "./view-course-dialog";
import type { Course } from "@/types/course";


interface CourseRowProps {
  course: Course;
}

export default function CourseRow({
  course,
}: CourseRowProps) {

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  async function handleDelete() {

  try {

    await deleteDoc(
      doc(
        db,
        "courses",
        course.id
      )
    );

    toast.success(
      "Course deleted successfully!"
    );

    setDeleteOpen(false);

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to delete course."
    );

  }

}

  return (

    <>
    <tr
      className="
        border-t
        hover:bg-slate-50
        transition-colors
      "
    >

      <td className="px-6 py-4">

        {course.imageUrl ? (

          <img
            src={course.imageUrl}
            alt={course.name}
            className="
              h-16
              w-16
              rounded-xl
              object-cover
            "
          />

        ) : (

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-sm
              text-slate-400
            "
          >
            No Image
          </div>

        )}

      </td>

      <td className="px-6 py-4 font-semibold">
        {course.name}
      </td>

      <td className="px-6 py-4">
        {course.level}
      </td>

      <td className="px-6 py-4">
        {course.duration}
      </td>

      <td className="px-6 py-4">

        <div
          className="
            flex
            justify-end
            gap-2
          "
        >

          <button
            onClick={() =>
              setViewOpen(true)
            }
            className="
              rounded-xl
              p-3
              transition
              hover:bg-slate-100
            "
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
            onClick={() =>
              setEditOpen(true)
            }
            className="
              rounded-xl
              p-3
              transition
              hover:bg-blue-100
            "
          >
            <Pencil
              className="
                h-5
                w-5
                text-blue-600
              "
            />
          </button>

          <button
            onClick={() =>
              setDeleteOpen(true)
            }
            className="
              rounded-xl
              p-3
              transition
              hover:bg-red-100
            "
          >
            <Trash2
              className="
                h-5
                w-5
                text-red-600
              "
            />
          </button>

        </div>

      </td>

    </tr>

    <ViewCourseDialog
      open={viewOpen}
      onOpenChange={setViewOpen}
      course={course}
    />

    <EditCourseDialog
      open={editOpen}
      onOpenChange={setEditOpen}
      course={course}
    />

    <DeleteCourseDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      courseName={course.name}
      onDelete={handleDelete}
    />

    </>

  );

}
"use client";

import { GraduationCap } from "lucide-react";
import AdminInput from "@/components/admin/admin-input";
import UploadBox from "@/components/admin/upload-box";

interface CourseFormProps {
  courseName: string;
  setCourseName: (value: string) => void;

  courseLevel: string;
  setCourseLevel: (value: string) => void;

  courseDuration: string;
  setCourseDuration: (value: string) => void;

  courseDescription: string;
  setCourseDescription: (value: string) => void;

  courseFile: File | null;
  setCourseFile: (file: File | null) => void;

  onAddCourse: () => void;
}

export default function CourseForm({
  courseName,
  setCourseName,
  courseLevel,
  setCourseLevel,
  courseDuration,
  setCourseDuration,
  courseDescription,
  setCourseDescription,
  courseFile,
  setCourseFile,
  onAddCourse,
}: CourseFormProps) {

  return (

    <div>
        <div
            id="courses"
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
            >

            <div className="mb-8 flex items-center gap-5">

                <div
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-violet-100
                "
                >

                <GraduationCap
                    className="
                    h-8
                    w-8
                    text-violet-600
                    "
                />

                </div>

                <div>

                <h2 className="text-3xl font-bold">
                    Add Course
                </h2>

                <p className="text-slate-500">
                    Create and publish training courses.
                </p>

                </div>

            </div>

            <div className="space-y-6">

            <AdminInput
            placeholder="Enter course name"
            value={courseName}
            onChange={setCourseName}
            color="violet"
            />

            <AdminInput
            placeholder="Enter course level"
            value={courseLevel}
            onChange={setCourseLevel}
            color="violet"
            />

            <AdminInput
            placeholder="e.g. 4 Weeks"
            value={courseDuration}
            onChange={setCourseDuration}
            color="violet"
            />

            <UploadBox
            file={courseFile}
            onChange={setCourseFile}
            title="Upload Course Image"
            accent="violet"
            />

            <textarea
            placeholder="Description"
            value={courseDescription}
            onChange={(e) =>
                setCourseDescription(
                e.target.value
                )
            }
            className="
            min-h-36
            w-full
            resize-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            transition
            outline-none
            focus:border-violet-500
            focus:bg-white
            focus:ring-4
            focus:ring-violet-100
            "
            />

            <button
            onClick={onAddCourse}
            className="rounded border p-3"
            >
            Add Course
            </button>

            </div>

        </div>
    </div>

  );

}
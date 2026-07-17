"use client";

import { useEffect, useState } from "react";
import CourseRow from "./course-row";
import CourseSearch from "./course-search";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import {
  SearchX,
} from "lucide-react";

import type { Course } from "@/types/course";

interface CourseTableProps {
  onAddCourse: () => void;
}

export default function CourseTable({
  onAddCourse,
}: CourseTableProps) {

  const [courses, setCourses] = useState<Course[]>([]);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "courses"),
        (snapshot) => {

          const list =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Course[];

        setCourses(list);

        }
      );

    return () => unsubscribe();

  }, []);

  const filteredCourses = courses.filter((course) => {

    const query = search.toLowerCase();

    return (
    course.name.toLowerCase().includes(query) ||
    course.level.toLowerCase().includes(query) ||
    course.slug.toLowerCase().includes(query)
    );

  });

  return (

    <section
      className="
        mt-12
        rounded-3xl
        border
        bg-white
        shadow-sm
        overflow-hidden
      "
    >

      <div
        className="
          border-b
          px-8
          py-6
          space-y-6
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >

          <div>

            <h2 className="text-2xl font-bold">
              Courses
            </h2>

            <p className="mt-2 text-slate-500">

              Showing

              <span className="font-semibold">
                {" "}
                {filteredCourses.length}
              </span>

              {" "}of{" "}

              <span className="font-semibold">
                {courses.length}
              </span>

              {" "}courses

            </p>

          </div>

          <button
            onClick={onAddCourse}
            className="
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            + Add Course
          </button>

        </div>

        <CourseSearch
          value={search}
          onChange={setSearch}
        />

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead
            className="
              bg-slate-50
            "
          >

            <tr>

              <th className="px-6 py-4 text-left">
                Image
              </th>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Level
              </th>

              <th className="px-6 py-4 text-left">
                Duration
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCourses.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="px-6 py-16"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                      "
                    >

                      <SearchX
                        className="
                          h-10
                          w-10
                          text-slate-400
                        "
                      />

                    </div>

                    <h3 className="mt-4 text-xl font-semibold">
                      No courses found
                    </h3>

                    <p className="mt-2 text-slate-500">
                      Try another search term.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredCourses.map((course) => (

                <CourseRow
                    key={course.id}
                    course={course}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>

  );

}
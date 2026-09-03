"use client";

import { useEffect, useMemo, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Course } from "@/types/course";
import { useUserRole } from "./use-user-role";
import { isTestItem } from "@/lib/is-test-item";

export function useCourses() {

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const role = useUserRole();

    async function loadCourses() {
        try {

            setLoading(true);

            const snapshot =
                await getDocs(
                    collection(db, "courses")
                );

            const courseList =
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Course[];

            setCourses(courseList);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load courses."
            );

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadCourses();
    }, []);

    // Test-named courses are only visible to admins (who need to see them
    // to manage/delete them); everyone else never sees them at all.
    const visibleCourses = useMemo(() => {
        if (role === "admin") return courses;
        return courses.filter((course) => !isTestItem(course.name));
    }, [courses, role]);

    return {
        courses: visibleCourses,
        loading,
        error,
        refreshCourses: loadCourses,
    };
}
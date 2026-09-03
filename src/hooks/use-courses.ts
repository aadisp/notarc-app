"use client";

import { useEffect, useMemo, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Course } from "@/types/course";
import { useUserRole } from "@/hooks/use-user-role";

export function useCourses() {

    const [rawCourses, setRawCourses] =
        useState<Course[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const role = useUserRole();
    const isAdmin = role === "admin";

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

            setRawCourses(courseList);

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

    // Courses named "Test" are for admins to try things out with and
    // shouldn't be visible to regular students. While the role is still
    // resolving (isAdmin is false by default), Test items stay hidden
    // rather than briefly flashing before the check completes.
    const courses = useMemo(() => {
        if (isAdmin) return rawCourses;

        return rawCourses.filter(
            (course) => course.name.trim().toLowerCase() !== "test"
        );
    }, [rawCourses, isAdmin]);

    return {
        courses,
        loading,
        error,
        refreshCourses: loadCourses,
    };
}
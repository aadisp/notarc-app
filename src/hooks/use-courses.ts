"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { Course } from "@/types/course";

export function useCourses() {

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

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

    return {
        courses,
        loading,
        error,
        refreshCourses: loadCourses,
    };
}
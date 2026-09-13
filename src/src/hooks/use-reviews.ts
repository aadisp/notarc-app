"use client";

import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import type { Review } from "@/types/review";

export function useReviews() {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Ordered by rating server-side (a single-field orderBy needs no
        // composite index). Ties are broken by most-recent-first, done
        // client-side after fetching so we don't require a composite
        // index just for the tiebreaker.
        const reviewsQuery = query(
            collection(db, "reviews"),
            orderBy("rating", "desc")
        );

        const unsubscribe = onSnapshot(
            reviewsQuery,
            (snapshot) => {

                const reviewList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Review[];

                reviewList.sort((a, b) => {
                    if (b.rating !== a.rating) {
                        return b.rating - a.rating;
                    }

                    return (
                        (b.createdAt?.toMillis?.() ?? 0) -
                        (a.createdAt?.toMillis?.() ?? 0)
                    );
                });

                setReviews(reviewList);
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();

    }, []);

    return { reviews, loading };
}
"use client";

import { useEffect, useState } from "react";
import {
    collection,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

/**
 * Tracks how many documents in `collectionName` have `timestampField`
 * newer than the last time ANY admin viewed this section — shared
 * across every admin via a single Firestore doc in `adminReadState`,
 * rather than per-browser localStorage.
 *
 * Pass `isActive: true` while the admin is actually looking at that
 * section (e.g. the current route matches it) to mark it seen for
 * everyone, clearing the badge going forward.
 */
export function useAdminSectionBadge(
    collectionName: string,
    timestampField: string,
    readStateDocId: string,
    isActive: boolean
): number {

    const [count, setCount] = useState(0);

    // Live count, rebuilt whenever the shared "last seen" threshold
    // changes (including when another admin marks the section seen).
    useEffect(() => {

        const readStateRef = doc(db, "adminReadState", readStateDocId);

        let countUnsubscribe: (() => void) | null = null;

        const readStateUnsubscribe = onSnapshot(
            readStateRef,
            (readStateSnap) => {

                const lastSeenAt: Timestamp =
                    readStateSnap.exists() && readStateSnap.data().lastSeenAt
                        ? (readStateSnap.data().lastSeenAt as Timestamp)
                        : Timestamp.fromMillis(0);

                if (countUnsubscribe) {
                    countUnsubscribe();
                }

                const countQuery = query(
                    collection(db, collectionName),
                    where(timestampField, ">", lastSeenAt)
                );

                countUnsubscribe = onSnapshot(countQuery, (countSnap) => {
                    setCount(countSnap.size);
                });

            }
        );

        return () => {
            readStateUnsubscribe();
            if (countUnsubscribe) countUnsubscribe();
        };

    }, [collectionName, timestampField, readStateDocId]);

    // Mark this section seen — for every admin — while it's active.
    useEffect(() => {

        if (!isActive) return;

        const readStateRef = doc(db, "adminReadState", readStateDocId);

        setDoc(
            readStateRef,
            { lastSeenAt: serverTimestamp() },
            { merge: true }
        );

    }, [isActive, readStateDocId]);

    return count;
}
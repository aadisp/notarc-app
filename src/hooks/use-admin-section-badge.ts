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
 * Tracks how many documents in `collectionName` count as "unseen" —
 * shared across every admin via a single Firestore doc in
 * `adminReadState`, rather than per-browser localStorage.
 *
 * `timestampFields` can be a single field name, or an array of field
 * names. When multiple fields are given, a document counts as unseen
 * if ANY of those fields is newer than the last-seen threshold — e.g.
 * for EDP applications, both a brand-new application (`createdAt`) and
 * an existing applicant finishing their exam (`examSubmittedAt`)
 * should reopen the badge. This is implemented as one listener per
 * field, merged client-side into a union of matching doc ids, rather
 * than a single Firestore OR query — that avoids needing a manual
 * composite index in the Firebase console.
 *
 * Pass `isActive: true` while the admin is actually looking at that
 * section (e.g. the current route matches it) to mark it seen for
 * everyone, clearing the badge going forward.
 */
export function useAdminSectionBadge(
    collectionName: string,
    timestampFields: string | string[],
    readStateDocId: string,
    isActive: boolean
): number {

    const fields = Array.isArray(timestampFields)
        ? timestampFields
        : [timestampFields];

    const fieldsKey = fields.join(",");

    const [count, setCount] = useState(0);

    // Live union count, rebuilt whenever the shared "last seen"
    // threshold changes (including when another admin marks the
    // section seen).
    useEffect(() => {

        const readStateRef = doc(db, "adminReadState", readStateDocId);

        let fieldUnsubscribers: Array<() => void> = [];

        // One id-set per watched field; the badge count is the size of
        // their union (a doc matching more than one field is only
        // counted once).
        const idsByField: Set<string>[] = fields.map(() => new Set());

        function recomputeCount() {
            const union = new Set<string>();

            idsByField.forEach((idSet) => {
                idSet.forEach((id) => union.add(id));
            });

            setCount(union.size);
        }

        const readStateUnsubscribe = onSnapshot(
            readStateRef,
            (readStateSnap) => {

                const lastSeenAt: Timestamp =
                    readStateSnap.exists() && readStateSnap.data().lastSeenAt
                        ? (readStateSnap.data().lastSeenAt as Timestamp)
                        : Timestamp.fromMillis(0);

                fieldUnsubscribers.forEach((unsubscribe) => unsubscribe());
                fieldUnsubscribers = [];

                fields.forEach((field, index) => {

                    const fieldQuery = query(
                        collection(db, collectionName),
                        where(field, ">", lastSeenAt)
                    );

                    const unsubscribe = onSnapshot(fieldQuery, (snap) => {
                        idsByField[index] = new Set(
                            snap.docs.map((docSnap) => docSnap.id)
                        );
                        recomputeCount();
                    });

                    fieldUnsubscribers.push(unsubscribe);

                });

            }
        );

        return () => {
            readStateUnsubscribe();
            fieldUnsubscribers.forEach((unsubscribe) => unsubscribe());
        };

    }, [collectionName, fieldsKey, readStateDocId]);

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
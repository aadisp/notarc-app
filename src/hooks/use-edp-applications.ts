"use client";

import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { EdpApplication } from "@/types/edp-application";

export function useEdpApplications() {
    const [applications, setApplications] = useState<EdpApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const q = query(
            collection(db, "edpApplications"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const data = snapshot.docs.map((doc) => ({

                id: doc.id,

                ...doc.data(),

            })) as EdpApplication[];

            setApplications(data);

            setLoading(false);

        });

        return unsubscribe;

    }, []);

    return {
        applications,
        loading,
    };
}
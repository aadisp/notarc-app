"use client";

import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { ContactMessage } from "@/types/contact";

export function useContacts() {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const q = query(
            collection(db, "contacts"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const data = snapshot.docs.map((doc) => ({

                id: doc.id,

                ...doc.data(),

            })) as ContactMessage[];

            setContacts(data);

            setLoading(false);

        });

        return unsubscribe;

    }, []);

    return {
        contacts,
        loading,
    };
}
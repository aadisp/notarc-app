"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";

interface AdminGuardProps {
    children: ReactNode;
}

export default function AdminGuard({
    children,
}: AdminGuardProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/");
                return;
            }

            const snapshot = await getDoc(
                doc(db, "users", user.uid)
            );

            if (
                snapshot.exists() &&
                snapshot.data().role === "admin"
            ) {
                setIsAdmin(true);
            } else {
                router.replace("/");
            }

            setLoading(false);
        });

        return unsubscribe;
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
}
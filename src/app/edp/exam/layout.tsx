"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function EdpExamLayout({
    children,
}: {
    children: ReactNode;
}) {

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (loading) return;

        if (!user) {
            router.push("/login");
        }

    }, [user, loading, router]);

    // Same loading/redirect guard as the main EDP layout, but with no
    // navbar rendered here at all — an account menu with a "Notarc"
    // link and a logout button is exactly the kind of one-tap
    // distraction an exam page shouldn't offer.
    if (loading || !user) {
        return <div className="min-h-screen bg-[#0b0d10]" />;
    }

    return (
        <div className="min-h-screen bg-[#0b0d10] text-white">
            {children}
        </div>
    );

}

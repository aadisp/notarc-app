"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import EdpNavbar from "@/components/edp/edp-navbar";

export default function EdpLayout({
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

  // While auth state is resolving, or right before the redirect kicks
  // in for a logged-out visitor, show a blank dark screen rather than
  // flashing the real EDP content.
  if (loading || !user) {
    return <div className="min-h-screen bg-[#0b0d10]" />;
  }

  return (
    <div className="min-h-screen bg-[#0b0d10]">
      <EdpNavbar />
      {children}
    </div>
  );

}

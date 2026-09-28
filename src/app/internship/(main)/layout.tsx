"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import InternshipNavbar from "@/components/internship/internship-navbar";
import InternshipFooter from "@/components/internship/internship-footer";

export default function InternshipLayout({
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
  // in for a logged-out visitor, show a blank light screen rather than
  // flashing the real Internship content.
  if (loading || !user) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <InternshipNavbar />
      {children}
      <InternshipFooter />
    </div>
  );

}
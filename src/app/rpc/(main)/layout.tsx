"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import RpcNavbar from "@/components/rpc/rpc-navbar";
import RpcFooter from "@/components/rpc/rpc-footer";

export default function RpcLayout({
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
  // in for a logged-out visitor, show a blank ink-navy screen — matches
  // the hero so there's no white flash before it paints.
  if (loading || !user) {
    return <div className="min-h-screen bg-[#0b1220]" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <RpcNavbar />
      {children}
      <RpcFooter />
    </div>
  );

}
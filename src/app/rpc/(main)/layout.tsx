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
  // in for a logged-out visitor, show a blank light screen rather than
  // flashing the real RPC content.
  if (loading || !user) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <RpcNavbar />
      {children}
      <RpcFooter />
    </div>
  );

}

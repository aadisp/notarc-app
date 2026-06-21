"use client";

import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, loading } =
    useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Profile
      </h1>

      <p className="mt-4">
        {user?.email}
      </p>
    </main>
  );
}
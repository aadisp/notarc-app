"use client";

import { useUserRole } from "@/hooks/use-user-role";

export default function AdminTestPage() {
  const role = useUserRole();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Admin Test
      </h1>

      <p className="mt-4">
        Role: {role}
      </p>
    </main>
  );
}
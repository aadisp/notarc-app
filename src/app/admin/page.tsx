"use client";

import { useUserRole } from "@/hooks/use-user-role";

export default function AdminPage() {
  const role = useUserRole();

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="mt-8 space-y-4">

        <button className="rounded border p-4">
          Add Product
        </button>

        <button className="rounded border p-4">
          Add Course
        </button>

      </div>
    </main>
  );
}
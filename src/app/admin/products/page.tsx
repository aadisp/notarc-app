"use client";

import { useUserRole } from "@/hooks/use-user-role";
import AdminNav from "@/components/admin/admin-nav";
export default function AdminProductsPage() {

  const role =
    useUserRole();

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (

    <main className="mx-auto max-w-xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Products
      </h1>

      <AdminNav />

    </main>

  );

}
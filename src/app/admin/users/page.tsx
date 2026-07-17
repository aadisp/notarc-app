"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useUserRole } from "@/hooks/use-user-role";

export default function AdminUsersPage() {

  const role = useUserRole();

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (

    <SiteLayout>

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Users
        </h1>

      </section>

    </SiteLayout>

  );

}
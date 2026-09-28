"use client";

import { useUserRole } from "@/hooks/use-user-role";
import Link from "next/link";

export default function AdminFab() {
  const role = useUserRole();

  if (role !== "admin") {
    return null;
  }

  return (
    <Link href="/admin">
      <button
        className="
          fixed
          bottom-6
          right-6
          h-14
          w-14
          rounded-full
          border
          text-3xl
          shadow-lg
        "
      >
        +
      </button>
    </Link>
  );
}
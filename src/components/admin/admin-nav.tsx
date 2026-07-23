"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Enrollments", href: "/admin/enrollments" },
  { name: "Users", href: "/admin/users" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 flex flex-wrap gap-3">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2 font-medium transition ${
              active
                ? "bg-black text-white"
                : "border bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
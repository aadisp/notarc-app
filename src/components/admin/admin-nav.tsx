"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/firebase";
import { useAdminSectionBadge } from "@/hooks/use-admin-section-badge";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Gallery", href: "/admin/gallery" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Enrollments", href: "/admin/enrollments" },
  { name: "EDP Applications", href: "/admin/edp" },
  { name: "Users", href: "/admin/users" },
  { name: "Messages", href: "/admin/messages" },
];

function isLinkActive(pathname: string, href: string) {
  return (
    pathname === href ||
    (href !== "/admin" && pathname.startsWith(href))
  );
}

// Messages/contacts already carry an explicit per-item
// "new" | "read" | "resolved" status (set to "read" when an admin
// opens that message) — that's inherently shared across admins
// already, so this badge just counts status === "new" directly rather
// than going through the shared last-seen mechanism used below.
function useMessagesBadge() {

  const [count, setCount] = useState(0);

  useEffect(() => {

    const messagesQuery = query(
      collection(db, "contacts"),
      where("status", "==", "new")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setCount(snapshot.size);
    });

    return () => unsubscribe();

  }, []);

  return count;
}

export default function AdminNav() {
  const pathname = usePathname();

  const ordersCount = useAdminSectionBadge(
    "orders",
    "createdAt",
    "orders",
    isLinkActive(pathname, "/admin/orders")
  );

  const enrollmentsCount = useAdminSectionBadge(
    "enrollments",
    "enrolledAt",
    "enrollments",
    isLinkActive(pathname, "/admin/enrollments")
  );

  const edpCount = useAdminSectionBadge(
    "edpApplications",
    "createdAt",
    "edp",
    isLinkActive(pathname, "/admin/edp")
  );

  const messagesCount = useMessagesBadge();

  const badgeCounts: Record<string, number> = {
    "/admin/orders": ordersCount,
    "/admin/enrollments": enrollmentsCount,
    "/admin/edp": edpCount,
    "/admin/messages": messagesCount,
  };

  return (
    <nav className="mb-10 flex flex-wrap gap-3">
      {links.map((link) => {
        const active = isLinkActive(pathname, link.href);
        const badgeCount = badgeCounts[link.href] ?? 0;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-xl px-4 py-2 font-medium transition ${
              active
                ? "bg-black text-white"
                : "border bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.name}

            {badgeCount > 0 && (
              <span
                className="
                  absolute
                  -left-2
                  -top-2
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-xs
                  font-bold
                  text-white
                  shadow
                "
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
"use client";

import { useEffect, type ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {

  // The root layout sets a dark body background globally (to match the
  // site's dark theme). Admin pages are intentionally kept light-themed,
  // so while any /admin/* route is mounted, override that background back
  // to white. Reverting on unmount lets the dark background take over
  // again as soon as the visitor navigates away from the admin section.
  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return <>{children}</>;
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronDown, LogOut } from "lucide-react";

const NAV_LINKS = [
  { id: "internship-vtu", label: "VTU" },
  { id: "internship-industry", label: "Industry" },
  { id: "internship-custom", label: "Custom" },
];

export default function InternshipNavbar() {

  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {

    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (userDoc) => {
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "");
        }
      }
    );

    return unsubscribe;

  }, [user]);

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-gray-200
        bg-white/95
        backdrop-blur-xl
      "
    >

      <div
        className="
          relative
          flex
          h-16
          w-full
          items-center
          justify-between
          pr-4
          sm:pr-6
        "
      >

        {/* Logo — flush to the left edge, with a little breathing room */}
        <Link
          href="/internship"
          onClick={(e) => {
            if (window.location.pathname === "/internship") {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="flex shrink-0 items-center pl-4 sm:pl-6"
        >

          <Image
            src="/notarc-internship-logo.png"
            alt="notarc Internship"
            width={254}
            height={38}
            priority
            className="h-7 w-auto"
          />

        </Link>

        {/* Nav links — true center of the header, independent of side widths
        <nav
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-14
            sm:flex
          "
        >

          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="
                text-sm
                font-semibold
                text-gray-900
                transition
                hover:text-amber-600
              "
            >
              {link.label}
            </button>
          ))}

        </nav> */}

        {/* Account dropdown — right edge */}
        <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>

          <DialogPrimitive.Trigger asChild>
            <button
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-gray-200
                bg-gray-50
                px-3
                py-2
                text-sm
                font-medium
                text-gray-900
                transition
                hover:bg-gray-100
              "
            >
              <span className="max-w-32 truncate">
                {username || user?.email || "Account"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          </DialogPrimitive.Trigger>

          <DialogPrimitive.Portal>

            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20" />

            <DialogPrimitive.Content
              className="
                fixed
                right-4
                top-16
                z-50
                w-48
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-gray-900
                shadow-2xl
                outline-none
              "
            >

              <DialogPrimitive.Title className="sr-only">
                Account menu
              </DialogPrimitive.Title>

              {user?.email && (
                <p className="truncate border-b border-gray-200 px-4 py-3 text-xs text-gray-500">
                  {user.email}
                </p>
              )}

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-gray-50"
              >
                Notarc
              </Link>

              <button
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-2
                  border-t
                  border-gray-200
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-red-600
                  hover:bg-red-50
                "
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </DialogPrimitive.Content>

          </DialogPrimitive.Portal>

        </DialogPrimitive.Root>

      </div>

    </header>

  );

}
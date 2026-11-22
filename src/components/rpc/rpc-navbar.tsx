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
  { id: "rpc-about", label: "About" },
  { id: "rpc-categories", label: "Categories" },
  { id: "rpc-partners", label: "Partners" },
  { id: "rpc-programme", label: "Programme" },
  { id: "rpc-enquiry", label: "Register" },
];

export default function RpcNavbar() {

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
        border-slate-200
        bg-white/90
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

        {/* Logo only — the page itself already identifies as RPC */}
        <Link
          href="/rpc"
          onClick={(e) => {
            if (window.location.pathname === "/rpc") {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="flex shrink-0 items-center pl-4 sm:pl-6"
        >

          <div className="relative h-7 w-28 shrink-0">
            <Image
              src="/ntrclogo.png"
              alt="NOTARC"
              fill
              priority
              sizes="112px"
              className="object-contain object-left filter brightness-0"
            />
          </div>

        </Link>

        {/* Nav links — true center of the header, independent of side widths */}
        <nav
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-9
            sm:flex
          "
        >

          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="
                group
                relative
                py-1
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:text-slate-900
              "
            >
              {link.label}
              <span
                className="
                  absolute
                  -bottom-0.5
                  left-0
                  h-[2px]
                  w-0
                  bg-sky-500
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </button>
          ))}

        </nav>

        {/* Account dropdown — right edge */}
        <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>

          <DialogPrimitive.Trigger asChild>
            <button
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                px-3
                py-2
                text-sm
                font-medium
                text-slate-900
                transition
                hover:border-slate-300
                hover:bg-slate-100
              "
            >
              <span className="max-w-32 truncate">
                {username || user?.email || "Account"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          </DialogPrimitive.Trigger>

          <DialogPrimitive.Portal>

            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/20" />

            <DialogPrimitive.Content
              className="
                fixed
                right-4
                top-16
                z-50
                w-48
                overflow-hidden
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-900
                shadow-2xl
                outline-none
              "
            >

              <DialogPrimitive.Title className="sr-only">
                Account menu
              </DialogPrimitive.Title>

              {user?.email && (
                <p className="truncate border-b border-slate-200 px-4 py-3 text-xs text-slate-500">
                  {user.email}
                </p>
              )}

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-slate-50"
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
                  border-slate-200
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
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

export default function EdpNavbar() {

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

  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-white/[0.08]
        bg-[#0b0d10]/95
        backdrop-blur-xl
      "
    >

      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
        "
      >

        <Link href="/edp" 
        onClick={(e) => {
            if (window.location.pathname === "/edp") {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="flex items-center gap-2">

          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/edp-logo.png"
              alt="EDP"
              fill
              priority
              sizes="44px"
              className="object-contain"
            />
          </div>

          <span className="hidden text-sm font-bold tracking-wide text-white sm:block">
            EKALAVYA DRONE PROGRAM
          </span>

        </Link>

        <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>

          <DialogPrimitive.Trigger asChild>
            <button
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.06]
                px-3
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/10
              "
            >
              <span className="max-w-32 truncate">
                {username || user?.email || "Account"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          </DialogPrimitive.Trigger>

          <DialogPrimitive.Portal>

            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />

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
                border-white/10
                bg-[#12151a]
                text-white
                shadow-2xl
                outline-none
              "
            >

              <DialogPrimitive.Title className="sr-only">
                Account menu
              </DialogPrimitive.Title>

              {user?.email && (
                <p className="truncate border-b border-white/10 px-4 py-3 text-xs text-gray-400">
                  {user.email}
                </p>
              )}

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-white/10"
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
                  border-white/10
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-red-400
                  hover:bg-red-500/10
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
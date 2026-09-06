"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Menu, X } from "lucide-react";

interface SavedAccount {
  uid: string;
  username: string;
  email: string;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Explore Products" },
  { href: "/courses", label: "Book a Course" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/cart", label: "Cart" },
  { href: "/#testimonials", label: "Reviews" },
];

export default function Navbar() {

  const { user } = useAuth();

  const role =
  useUserRole();

  const router = useRouter();

  const [username,
    setUsername] =
    useState("");

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [scrolled,
    setScrolled] =
    useState(false);

  const [savedAccounts,
    setSavedAccounts] =
    useState<SavedAccount[]>([]);

  useEffect(() => {

    if (!user) return;

    const unsubscribe =
      onSnapshot(
        doc(
          db,
          "users",
          user.uid
        ),
        (userDoc) => {

          if (
            userDoc.exists()
          ) {

            setUsername(
              userDoc.data()
                .username || ""
            );

          }

          const accounts =
            JSON.parse(
              localStorage.getItem(
                "notarcAccounts"
              ) || "[]"
            );

          setSavedAccounts(
            accounts
          );

        }
      );

    return () =>
      unsubscribe();

  }, [user]);

  useEffect(() => {

    function handleScroll() {

      setScrolled(
        window.scrollY > 50
      );

    }

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  function removeSavedAccount(
    uid: string
  ) {

    const updatedAccounts =
      savedAccounts.filter(
        (account) =>
          account.uid !== uid
      );

    localStorage.setItem(
      "notarcAccounts",
      JSON.stringify(
        updatedAccounts
      )
    );

    setSavedAccounts(
      updatedAccounts
    );

  }

  async function handleLogout() {

    await signOut(auth);
    setSidebarOpen(false);

  }

  // For links like "/#testimonials": if we're already on the target
  // page, smooth-scroll to the section instead of doing a full
  // navigation. If we're on a different page, let the Link navigate
  // normally — Next.js's router scrolls to the hash once the target
  // page has loaded.
  function handleNavLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) {

    const [path, hash] = href.split("#");

    if (!hash) return;

    const targetPath = path || "/";

    if (window.location.pathname === targetPath) {

      event.preventDefault();

      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth" });

    }

  }

  return (

    <header
      className={`
        sticky
        top-0
        z-50
        w-full
        border-b
        border-white/[0.08]
        bg-black/90
        backdrop-blur-xl
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-black/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            : "bg-black/70"
        }
      `}
    >

      <div
        className={`
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          pl-0
          pr-6
          md:px-6
          transition-all
          duration-300
          ${
            scrolled
              ? "h-16"
              : "h-20"
          }
        `}
      >

        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="shrink-0 md:-translate-x-28"
        >
          <div
            className={`
              relative
              overflow-hidden
              transition-all
              duration-300
              ${
                scrolled
                  ? "h-11 w-36"
                  : "h-12 w-40"
              }
            `}
          >
            <Image
              src="/ntrclogo.png"
              alt="NOTARC"
              fill
              priority
              sizes="160px"
              className="object-cover object-center"
            />
          </div>
        </Link>

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-1
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.04]
            p-1
            text-sm
            font-medium
          "
        >

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className="
                rounded-full
                px-4
                py-2
                text-white/75
                transition-all
                duration-300
                ease-out
                hover:bg-white/10
                hover:text-white
                hover:-translate-y-0.5
                hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]
                active:translate-y-0
              "
            >
              {link.label}
            </Link>
          ))}

        </nav>

        <DialogPrimitive.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>

          <div className="flex items-center gap-2">

            {!user && (
              <DialogPrimitive.Trigger asChild>
                <button
                  aria-label="Open menu"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.08]
                    text-white
                    transition
                    hover:bg-white/[0.14]
                  "
                >
                  <Menu className="h-5 w-5" />
                </button>
              </DialogPrimitive.Trigger>
            )}

            {user ? (

              <DialogPrimitive.Trigger asChild>
                <button
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.08]
                    px-2
                    py-2
                    text-white
                    shadow-lg
                    shadow-black/10
                    backdrop-blur-sm
                    transition-all
                    duration-200
                    hover:border-white/20
                    hover:bg-white/[0.14]
                    hover:scale-[1.02]
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-sm
                      font-bold
                      text-black
                      shadow-sm
                    "
                  >
                    {(username ||
                      user.email ||
                      "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="max-w-32 truncate text-sm font-medium text-white/90">
                    {username ||
                      user.email}
                  </span>

                </button>
              </DialogPrimitive.Trigger>

            ) : (

              <div className="flex items-center gap-2">

                <Link
                  href="/login"
                  className="
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white/80
                    transition-all
                    duration-200
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="
                    rounded-full
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-blue-500
                    hover:text-white
                    hover:shadow-lg
                    hover:shadow-blue-500/20
                  "
                >
                  Signup
                </Link>

              </div>

            )}

          </div>

          <DialogPrimitive.Portal>

            <DialogPrimitive.Overlay
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
            />

            <DialogPrimitive.Content
              className="
                fixed
                inset-y-0
                right-0
                z-50
                flex
                h-full
                w-[88vw]
                max-w-md
                flex-col
                overflow-y-auto
                border-l
                border-white/10
                bg-[#0b0d10]
                p-6
                text-white
                shadow-2xl
                outline-none
                duration-300
                data-open:animate-in
                data-open:slide-in-from-right
                data-closed:animate-out
                data-closed:slide-out-to-right
                sm:w-[440px]
              "
            >

              <div className="mb-8 flex items-center justify-between">

                <DialogPrimitive.Title className="text-2xl font-bold text-white">
                  Menu
                </DialogPrimitive.Title>

                <DialogPrimitive.Close asChild>
                  <button
                    aria-label="Close menu"
                    className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </DialogPrimitive.Close>

              </div>

              {user && (
                <div className="mb-6 border-b border-white/10 pb-6">
                  <p className="font-semibold text-white">
                    {username}
                  </p>
                  <p className="truncate text-sm text-white/50">
                    {user.email}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <p
                    className="
                      mb-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-white/40
                    "
                  >
                    Navigation
                  </p>

                  <div className="flex flex-col">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                          handleNavLinkClick(e, link.href);
                          setSidebarOpen(false);
                        }}
                        className="rounded-lg px-2 py-2.5 text-sm hover:bg-white/10"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                </div>

                <div>

                  <p
                    className="
                      mb-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-white/40
                    "
                  >
                    Account
                  </p>

                  {user ? (

                    <div className="flex flex-col">

                      <Link
                        href="/profile"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg px-2 py-2.5 text-sm hover:bg-white/10"
                      >
                        Profile
                      </Link>

                      <Link
                        href="/my-courses"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg px-2 py-2.5 text-sm hover:bg-white/10"
                      >
                        My Courses
                      </Link>

                      <Link
                        href="/my-orders"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg px-2 py-2.5 text-sm hover:bg-white/10"
                      >
                        My Orders
                      </Link>

                      {role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setSidebarOpen(false)}
                          className="rounded-lg px-2 py-2.5 text-sm hover:bg-white/10"
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="mt-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-500/10"
                      >
                        Logout
                      </button>

                    </div>

                  ) : (

                    <div className="flex flex-col gap-2">

                      <Link
                        href="/login"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg border border-white/15 px-3 py-2.5 text-center text-sm text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        Login
                      </Link>

                      <Link
                        href="/signup"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg bg-white px-3 py-2.5 text-center text-sm font-semibold text-black hover:bg-white/90"
                      >
                        Signup
                      </Link>

                    </div>

                  )}

                </div>

              </div>

              {user && (

                <div className="mt-8 border-t border-white/10 pt-6">

                  <p
                    className="
                      mb-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-white/40
                    "
                  >
                    Accounts
                  </p>

                  {savedAccounts.map(
                    (account) => (

                      <div
                        key={account.uid}
                        className={`
                          mb-2
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          transition
                          hover:bg-white/10
                          ${
                            account.uid === user.uid
                              ? "bg-white/10"
                              : ""
                          }
                        `}
                      >

                        <button
                          onClick={() => {

                            if (
                              account.uid ===
                              user.uid
                            ) {
                              return;
                            }

                            localStorage.setItem(
                              "notarcSelectedAccount",
                              JSON.stringify(
                                account
                              )
                            );

                            setSidebarOpen(false);

                            router.push(
                              "/login"
                            );

                          }}
                          className="
                            flex
                            flex-1
                            items-center
                            gap-3
                            p-2
                            text-left
                          "
                        >

                          <div className="relative">

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-slate-900
                                text-white
                                font-bold
                              "
                            >
                              {account.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            {account.uid ===
                              user.uid && (

                              <div
                                className="
                                  absolute
                                  -bottom-0.5
                                  -right-0.5
                                  h-3
                                  w-3
                                  rounded-full
                                  border-2
                                  border-white
                                  bg-green-500
                                "
                              />

                            )}

                          </div>

                          <div className="min-w-0">

                            <p
                              className="
                                truncate
                                text-sm
                                font-medium
                                text-white
                              "
                            >
                              {account.username}
                            </p>

                            <p
                              className="
                                truncate
                                text-xs
                                text-white/50
                              "
                            >
                              {account.email}
                            </p>

                          </div>

                        </button>

                        <button
                          onClick={() => {

                            if (
                              account.uid === user.uid
                            ) {
                              return;
                            }

                            removeSavedAccount(
                              account.uid
                            );

                          }}
                          className="
                            mr-2
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition
                            hover:bg-red-500/10
                            hover:text-red-500
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                          disabled={
                            account.uid === user.uid
                          }
                          title={
                            account.uid === user.uid
                              ? "Current account"
                              : "Remove account"
                          }
                        >
                          ✕
                        </button>

                      </div>

                    )
                  )}

                  <Link
                    href="/login"
                    onClick={() => {

                      localStorage.removeItem(
                        "notarcSelectedAccount"
                      );

                      setSidebarOpen(false);

                    }}
                    className="
                      mt-3
                      block
                      rounded-xl
                      border
                      border-white/10
                      px-3
                      py-2
                      text-center
                      text-white/70
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    + Add another account
                  </Link>

                </div>

              )}

            </DialogPrimitive.Content>

          </DialogPrimitive.Portal>

        </DialogPrimitive.Root>

      </div>

    </header>

  );

}
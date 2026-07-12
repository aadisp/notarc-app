"use client";

import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";

interface SavedAccount {
  uid: string;
  username: string;
  email: string;
}

export default function Navbar() {

  const { user } = useAuth();

  const router = useRouter();

  const [username,
    setUsername] =
    useState("");

  const [menuOpen,
    setMenuOpen] =
    useState(false);

  const [scrolled,
    setScrolled] =
    useState(false);

  const [savedAccounts,
    setSavedAccounts] =
    useState<SavedAccount[]>([]);

  const menuRef =
    useRef<HTMLDivElement>(null);

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

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
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

  }

  return (

    <header
      className={`
        sticky
        top-0
        z-50
        w-full
        border-b
        backdrop-blur-md
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-white/95 shadow-md"
            : "bg-white/80"
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
          px-6
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

            if (
              window.location.pathname ===
              "/"
            ) {

              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

            }

          }}
        >

          <h1
            className={`
              font-black
              tracking-tight
              transition-all
              duration-300
              ${
                scrolled
                  ? "text-2xl"
                  : "text-3xl"
              }
            `}
          >
            NOTARC
          </h1>

        </Link>

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-10
            text-base
            font-medium
          "
        >

          <Link href="/" className="transition hover:text-blue-600">
            Home
          </Link>

          <Link href="/products" className="transition hover:text-blue-600">
            Explore Products
          </Link>

          <Link href="/courses" className="transition hover:text-blue-600">
            Book a Course
          </Link>

          <Link href="/gallery" className="transition hover:text-blue-600">
            Gallery
          </Link>

          <Link href="/cart" className="transition hover:text-blue-600">
            Cart
          </Link>

        </nav>

        {user ? (

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="
                flex
                items-center
                gap-3
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-2
                shadow-sm
                transition-all
                hover:scale-[1.02]
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-900
                  text-base
                  font-bold
                  text-white
                "
              >
                {(username ||
                  user.email ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span className="font-medium">
                {username ||
                  user.email}
              </span>

              <span
                className={`
                  transition-transform
                  duration-200
                  ${
                    menuOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              >
                ▼
              </span>

            </button>

            {menuOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-72
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-xl
                  z-50
                "
              >

                <div className="border-b px-5 py-4">

                  <p className="font-semibold text-lg">
                    {username}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>

                </div>

                <Link
                  href="/profile"
                  className="block px-5 py-3 hover:bg-slate-50"
                >
                  Profile
                </Link>

                <Link
                  href="/my-courses"
                  className="block px-5 py-3 hover:bg-slate-50"
                >
                  My Courses
                </Link>

                <Link
                  href="/my-orders"
                  className="block px-5 py-3 hover:bg-slate-50"
                >
                  My Orders
                </Link>

                <hr />

                <div className="px-5 py-3">

                  <p
                    className="
                      mb-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
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
                          hover:bg-slate-100
                          ${
                            account.uid === user.uid
                              ? "bg-slate-100"
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

                            setMenuOpen(false);

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
                                h-10
                                w-10
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

                          <div>

                            <p
                              className="
                                font-medium
                                text-slate-900
                              "
                            >
                              {account.username}
                            </p>

                            <p
                              className="
                                text-xs
                                text-slate-500
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
                            items-center
                            justify-center
                            rounded-full
                            text-slate-400
                            transition
                            hover:bg-red-100
                            hover:text-red-600
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

                      setMenuOpen(false);

                    }}
                    className="
                      mt-3
                      block
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-center
                      transition
                      hover:bg-slate-50
                    "
                  >
                    + Add another account
                  </Link>

                </div>

                <hr />

                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    block
                    w-full
                    px-5
                    py-4
                    text-left
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        ) : (

          <div className="flex items-center gap-4">

            <Link href="/login">
              Login
            </Link>

            <Link href="/signup">
              Signup
            </Link>

          </div>

        )}

      </div>

    </header>

  );

}
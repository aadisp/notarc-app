"use client";

import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function Navbar() {

  const { user } = useAuth();

  const [username,
    setUsername] =
    useState("");

  const [menuOpen,
    setMenuOpen] =
    useState(false);

  const [scrolled,
    setScrolled] =
    useState(false);

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
        }
      );

    return () => unsubscribe();

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

          <Link
            href="/"
            className="
              transition
              hover:text-blue-600
            "
          >
            Home
          </Link>

          <Link
            href="/products"
            className="
              transition
              hover:text-blue-600
            "
          >
            Explore Products
          </Link>

          <Link
            href="/courses"
            className="
              transition
              hover:text-blue-600
            "
          >
            Book a Course
          </Link>

          <Link
            href="/gallery"
            className="
              transition
              hover:text-blue-600
            "
          >
            Gallery
          </Link>

          <Link
            href="/cart"
            className="
              transition
              hover:text-blue-600
            "
          >
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

              <span
                className="
                  font-medium
                  text-base
                "
              >
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
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-xl
                  z-50
                "
              >

                <div
                  className="
                    border-b
                    px-4
                    py-4
                  "
                >

                  <p
                    className="
                      font-semibold
                    "
                  >
                    {username}
                  </p>

                  <p
                    className="
                      truncate
                      text-sm
                      text-slate-500
                    "
                  >
                    {user.email}
                  </p>

                </div>

                <Link
                  href="/profile"
                  className="
                    block
                    px-4
                    py-3
                    transition
                    hover:bg-slate-50
                  "
                >
                  Profile
                </Link>

                <Link
                  href="/my-courses"
                  className="
                    block
                    px-4
                    py-3
                    transition
                    hover:bg-slate-50
                  "
                >
                  My Courses
                </Link>

                <Link
                  href="/my-orders"
                  className="
                    block
                    px-4
                    py-3
                    transition
                    hover:bg-slate-50
                  "
                >
                  My Orders
                </Link>

                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    block
                    w-full
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-slate-50
                  "
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        ) : (

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

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
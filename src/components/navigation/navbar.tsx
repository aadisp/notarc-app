"use client";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  async function handleLogout() {
    await signOut(auth);
  }
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-xl font-bold">NOTARC</h1>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/products">Explore Products</Link>
          <Link href="/courses">Book a Course</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/cart">Cart</Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
            >
              Logout
            </button>
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
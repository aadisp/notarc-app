import Link from "next/link";

export default function Navbar() {
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

        <button>
          Sign In
        </button>
      </div>
    </header>
  );
}
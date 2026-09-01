"use client";

import { useProducts } from "@/hooks/use-products";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ProductGrid from "@/components/products/product-grid";
import ProductToolbar from "@/components/products/product-toolbar";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
  } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements (e.g. the sort
  // dropdown) also pick up the dark theme variables from globals.css.
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    switch (sort) {
        case "price-low":
            return [...filtered].sort(
                (a, b) => a.price - b.price
            );

        case "price-high":
            return [...filtered].sort(
                (a, b) => b.price - a.price
            );

        case "name-asc":
            return [...filtered].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

        case "name-desc":
            return [...filtered].sort((a, b) =>
                b.name.localeCompare(a.name)
            );

        case "newest":
        default:
            return filtered;
    }
}, [products, search, category, sort]);
  return (
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-24">
          <div className="mb-16">

            {/* <span className="rounded-full border px-4 py-2 text-sm font-medium">
                NOTARC STORE
            </span> */}

            <h1 className="text-5xl font-extrabold tracking-tight text-white lg:whitespace-nowrap lg:text-6xl">
                Professional Drone & Robotics Equipment
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/60">
                Discover premium drones, robotics kits, electronic components,
                accessories, and engineering tools designed for students,
                makers, researchers, and professionals.
            </p>

        </div>

        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
      />

        {loading ? (
              <div className="py-24 text-center text-white/60">
                  Loading products...
              </div>
          ) : error ? (
              <div className="py-24 text-center text-red-400">
                  {error}
              </div>
          ) : (
              <ProductGrid
                  products={filteredProducts}
                  onClearFilters={() => {
                      setSearch("");
                      setCategory("All");
                      setSort("newest");
                  }}
              />
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
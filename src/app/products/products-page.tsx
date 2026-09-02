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
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState("newest");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const { priceMin, priceMax } = useMemo(() => {
    if (products.length === 0) {
      return { priceMin: 0, priceMax: 0 };
    }

    const prices = products.map((product) => product.price);

    return {
      priceMin: Math.min(...prices),
      priceMax: Math.max(...prices),
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  // Keep the price range in sync with the actual data once products load,
  // but only reset it when the underlying min/max bounds change (not on
  // every render), so the user's own slider adjustments aren't clobbered.
  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function clearAllFilters() {
    setSearch("");
    setSelectedCategories(new Set());
    setSort("newest");
    setPriceRange([priceMin, priceMax]);
  }

  // Radix components (Select, Dialog, etc.) portal their popup content to
  // document.body, outside the scoped <div> below. Toggling the `dark`
  // class on <html> ensures those portaled elements (e.g. the sort
  // dropdown, the filter panel) also pick up the dark theme variables
  // from globals.css.
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
            selectedCategories.size === 0 ||
            selectedCategories.has(product.category);

        const matchesPrice =
            product.price >= priceRange[0] &&
            product.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
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
}, [products, search, selectedCategories, sort, priceRange]);
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
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClearCategories={() => setSelectedCategories(new Set())}
          sort={sort}
          onSortChange={setSort}
          filterPanelOpen={filterPanelOpen}
          onFilterPanelOpenChange={setFilterPanelOpen}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          priceMin={priceMin}
          priceMax={priceMax}
          onClearAllFilters={clearAllFilters}
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
                  onClearFilters={clearAllFilters}
              />
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
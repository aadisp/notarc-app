"use client";

import { useProducts } from "@/hooks/use-products";
import { useMemo, useState } from "react";
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
  const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16">

          <span className="rounded-full border px-4 py-2 text-sm font-medium">
              NOTARC STORE
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight lg:text-7xl">
              Professional Drone
              <br />
              & Robotics Equipment
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
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
      />

      {loading ? (
            <div className="py-24 text-center">
                Loading products...
            </div>
        ) : error ? (
            <div className="py-24 text-center text-red-500">
                {error}
            </div>
        ) : (
            <ProductGrid products={filteredProducts} />
        )}
      </section>
    </SiteLayout>
  );
}
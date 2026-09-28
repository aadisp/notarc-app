"use client";

import { useEffect, type CSSProperties } from "react";
import { useProducts } from "@/hooks/use-products";
import { useProductFilters } from "@/hooks/use-product-filters";
import SiteLayout from "@/components/layout/site-layout";
import ProductGrid from "@/components/products/product-grid";
import ProductToolbar from "@/components/products/product-toolbar";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const catalog = useProductFilters(products);

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

  return (
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-[1400px] px-4 pt-10 pb-24 sm:px-6">

          <div className="mb-12 sm:mb-16">

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:whitespace-nowrap lg:text-6xl">
                Professional Drone & Robotics Equipment
            </h1>

            <p className="mt-4 max-w-2xl text-base text-white/60 sm:mt-6 sm:text-lg">
                Discover premium drones, robotics kits, electronic components,
                accessories, and engineering tools designed for students,
                makers, researchers, and professionals.
            </p>

          </div>

          <ProductToolbar catalog={catalog} />

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
                  products={catalog.filteredProducts}
                  onClearFilters={catalog.clearAllFilters}
              />
          )}

        </section>
      </div>
    </SiteLayout>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

import Link from "next/link";

import { db } from "@/firebase/firebase";
import { useUserRole } from "@/hooks/use-user-role";

import ProductCard from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrls: string[];
}

export default function ProductsPreview() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const role = useUserRole();
  const isAdmin = role === "admin";

  useEffect(() => {
    async function loadProducts() {
      // Fetch a few extra beyond the 3 we display, since a Test product
      // may get filtered out below and we still want a full row of 3
      // for non-admins.
      const snapshot = await getDocs(
        query(
          collection(db, "products")
        )
      );

      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setRawProducts(productList);
      setLoading(false);
    }

    loadProducts();
  }, []);

  // Products named "Test" are for admins to try things out with and
  // shouldn't be visible to regular shoppers. While the role is still
  // resolving (isAdmin is false by default), Test items stay hidden
  // rather than briefly flashing before the check completes.
  const products = useMemo(() => {
    const visible = isAdmin
      ? rawProducts
      : rawProducts.filter(
          (product) => product.name.trim().toLowerCase() !== "test"
        );

    return visible.slice(0, 3);
  }, [rawProducts, isAdmin]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">

      <div className="mb-8 sm:mb-10">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Explore Products
        </h2>

        <p className="mt-3 text-sm text-white/60 italic sm:mt-4 sm:text-base">
          Discover drones, components, kits, and accessories.
        </p>
      </div>

      {!loading && products.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/[0.5] px-6 py-16 text-center">

          <p className="text-lg font-medium text-white">
            No products available right now
          </p>

          <p className="mt-2 max-w-sm text-sm text-white/50">
            We&apos;re restocking our lineup. Check back soon for new drones,
            components, and kits.
          </p>

        </div>

      ) : (

        <>

          {/* Mobile swipe carousel */}
          <div className="md:hidden">

            <div
              className="
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                overscroll-x-contain
                pb-4
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >

              {products.map((product) => (

                <div
                  key={product.id}
                  className="w-[88%] shrink-0 snap-center"
                >

                  <ProductCard product={product} />

                </div>

              ))}

            </div>

          </div>


          {/* Desktop / tablet grid */}
          <div className="hidden gap-8 md:grid md:grid-cols-3">

            {products.map((product) => (

              <ProductCard key={product.id} product={product} />

            ))}

          </div>

        </>

      )}

      <div className="mt-6 sm:mt-8">

        <Link href="/products">

          <Button>
            View All Products
          </Button>

        </Link>

      </div>

    </section>
  );
}
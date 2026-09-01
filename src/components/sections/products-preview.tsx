"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import Link from "next/link";

import { db } from "@/firebase/firebase";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const snapshot = await getDocs(
        query(
          collection(db, "products"),
          limit(3)
        )
      );

      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productList);
      setLoading(false);
    }

    loadProducts();
  }, []);

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

                  <ProductCard
                    id={product.id}
                    firestoreId={product.id}
                    name={product.name}
                    price={`₹${product.price}`}
                    category={product.category}
                    slug={product.slug}
                    description={product.description}
                    imageUrls={product.imageUrls}
                  />

                </div>

              ))}

            </div>

          </div>


          {/* Desktop / tablet grid */}
          <div className="hidden gap-8 md:grid md:grid-cols-3">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                id={product.id}
                firestoreId={product.id}
                name={product.name}
                price={`₹${product.price}`}
                category={product.category}
                slug={product.slug}
                description={product.description}
                imageUrls={product.imageUrls}
              />

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
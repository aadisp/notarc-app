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
  imageUrl?: string;
}

export default function ProductsPreview() {

  const [products, setProducts] =
    useState<Product[]>([]);

  useEffect(() => {

    async function loadProducts() {

      const snapshot =
        await getDocs(
          query(
            collection(
              db,
              "products"
            ),
            limit(3)
          )
        );

      const productList =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Product[];

      setProducts(
        productList
      );

    }

    loadProducts();

  }, []);

  return (

    <section className="mx-auto max-w-7xl px-6 py-40">

      <div className="mb-12">

        <h2 className="text-4xl font-bold">
          Explore Products
        </h2>

        <p className="mt-4 text-muted-foreground">
          Discover drones, components, kits, and accessories.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            id={products.indexOf(product) + 1}
            firestoreId={product.id}
            name={product.name}
            price={`₹${product.price}`}
            category={product.category}
            slug={product.slug}
            description={product.description}
            imageUrl={product.imageUrl}
          />

        ))}

      </div>

      <div className="mt-10">

        <Link href="/products">

          <Button>
            View All Products
          </Button>

        </Link>

      </div>

    </section>

  );

}
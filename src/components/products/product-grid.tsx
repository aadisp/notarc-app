"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import ProductCard from "@/components/cards/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export default function ProductGrid() {
  const [products, setProducts] =
    useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const snapshot =
        await getDocs(
          collection(db, "products")
        );

      const productList =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

      setProducts(productList);
    }

    loadProducts();
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={products.indexOf(product) + 1}
          firestoreId={product.id}
          name={product.name}
          price={`₹${product.price}`}
          category={product.category}
          slug={product.slug}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}
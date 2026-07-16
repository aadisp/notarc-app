"use client";

import { useEffect, useState } from "react";
import ProductRow from "./product-row";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import {
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

interface Product {

  id: string;

  name: string;

  category: string;

  price: number;

  imageUrl?: string;

}

export default function ProductTable() {

  const [products,
    setProducts] =
    useState<Product[]>([]);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "products"),
        (snapshot) => {

          const list =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Product[];

          setProducts(list);

        }
      );

    return () => unsubscribe();

  }, []);

  return (

    <section
      className="
        mt-12
        rounded-3xl
        border
        bg-white
        shadow-sm
        overflow-hidden
      "
    >

      <div
        className="
          border-b
          px-8
          py-6
        "
      >

        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <p className="mt-2 text-slate-500">
          Manage all products.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead
            className="
              bg-slate-50
            "
          >

            <tr>

              <th className="px-6 py-4 text-left">
                Image
              </th>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Category
              </th>

              <th className="px-6 py-4 text-left">
                Price
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <ProductRow
                key={product.id}
                product={product}
              />

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}
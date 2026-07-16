"use client";

import { useEffect, useState } from "react";
import ProductRow from "./product-row";
import ProductSearch from "./product-search";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import {
  SearchX,
} from "lucide-react";

import type { Product } from "@/types/product";

interface ProductTableProps {
  onAddProduct: () => void;
}

export default function ProductTable({
  onAddProduct,
}: ProductTableProps) {

  const [products,
    setProducts] =
    useState<Product[]>([]);

  const [search,
    setSearch] =
    useState("");

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

  const filteredProducts = products.filter((product) => {

    const query = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query)
    );

  });

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
          space-y-6
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >

          <div>

            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <p className="mt-2 text-slate-500">

              Showing

              <span className="font-semibold">
                {" "}
                {filteredProducts.length}
              </span>

              {" "}of{" "}

              <span className="font-semibold">
                {products.length}
              </span>

              {" "}products

            </p>

          </div>

          <button
            onClick={onAddProduct}
            className="
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            + Add Product
          </button>

        </div>

        <ProductSearch
          value={search}
          onChange={setSearch}
        />

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

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="px-6 py-16"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                      "
                    >

                      <SearchX
                        className="
                          h-10
                          w-10
                          text-slate-400
                        "
                      />

                    </div>

                    <h3 className="mt-4 text-xl font-semibold">
                      No products found
                    </h3>

                    <p className="mt-2 text-slate-500">
                      Try another search term.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredProducts.map((product) => (

                <ProductRow
                  key={product.id}
                  product={product}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>

  );

}
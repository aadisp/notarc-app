"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useUserRole } from "@/hooks/use-user-role";
import { products } from "@/data/products";

export default function AdminPage() {
  const role = useUserRole();

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  async function handleAddProduct() {
    try {
      await addDoc(
        collection(db, "products"),
        {
          name,
          slug,
          category,
          price: Number(price),
          description,
        }
      );

      alert("Product added");
    } catch (error) {
      console.error(error);
    }
  }

  async function importDefaultProducts() {
    try {
      for (const product of products) {
        await addDoc(
          collection(db, "products"),
          {
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            description:
              product.description,
          }
        );
      }

      alert("Products imported");
    } catch (error) {
      console.error(error);
    }
  }

  if (role !== "admin") {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="space-y-4">

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded border p-3"
        />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value)
          }
          className="w-full rounded border p-3"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full rounded border p-3"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />

        <button
          onClick={handleAddProduct}
          className="rounded border p-3"
        >
          Add Product
        </button>

        <button
          onClick={importDefaultProducts}
          className="rounded border p-3"
        >
          Import Default Products
        </button>

      </div>

    </main>
  );
}
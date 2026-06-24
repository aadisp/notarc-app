"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useUserRole } from "@/hooks/use-user-role";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  firestoreId: string;
  name: string;
  price: string;
  category: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export default function ProductCard({
  id,
  firestoreId,
  name,
  price,
  category,
  slug,
  description,
  imageUrl,
}: ProductCardProps) {

  const addItem = useCartStore(
    (state) => state.addItem
  );
  const role = useUserRole();

  const [editing, setEditing] =
  useState(false);

  const [editName, setEditName] =
    useState(name);

  const [editCategory, setEditCategory] =
    useState(category);

  const [editPrice, setEditPrice] =
    useState(
      price.replace(/[^\d]/g, "")
    );

  const [editDescription,
    setEditDescription] =
    useState(description);

  const [editImageUrl,
    setEditImageUrl] =
    useState(imageUrl || "");

  async function handleDelete() {
    try {
      await deleteDoc(
        doc(
          db,
          "products",
          firestoreId
        )
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate() {
    try {
      await updateDoc(
        doc(
          db,
          "products",
          firestoreId
        ),
        {
          name: editName,
          category: editCategory,
          price: Number(editPrice),
          description: editDescription,
          imageUrl: editImageUrl,
        }
      );

      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="group overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg">

     <div className="aspect-[4/3] overflow-hidden bg-slate-200">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : null}

    </div>

      <div className="space-y-4 p-6">

        <div>
          <p className="text-sm text-muted-foreground">
            {category}
          </p>

          <h3 className="text-xl font-semibold">
            {name}
          </h3>
        </div>

        {editing && (
          <div className="space-y-2 rounded border p-3">

            <input
              value={editName}
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <input
              value={editCategory}
              onChange={(e) =>
                setEditCategory(
                  e.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <input
              value={editPrice}
              onChange={(e) =>
                setEditPrice(
                  e.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <input
              value={editImageUrl}
              onChange={(e) =>
                setEditImageUrl(
                  e.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <Button
              onClick={handleUpdate}
            >
              Save Changes
            </Button>

          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-bold">
            {price}
          </span>

          <div className="flex gap-2">

            <Link href={`/products/${slug}`}>
              <Button size="sm" variant="outline">
                View
              </Button>
            </Link>

            {role === "admin" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditing(!editing)
                  }
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}

            <Button
              size="sm"
              onClick={() => {
                console.log("ADD CLICKED", name);

                addItem({
                  id,
                  name,
                  price: Number(
                    price.replace(/[^\d]/g, "")
                  ),
                });

                console.log(
                  "AFTER ADD",
                  useCartStore.getState().items
                );
              }}
            >
              Add
            </Button>

          </div>
        </div>

      </div>
    </div>
  );
}
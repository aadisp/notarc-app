"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import EditProductDialog from "./edit-product-dialog";
import DeleteProductDialog from "./delete-product-dialog";
import ViewProductDialog from "./view-product-dialog";
import type { Product } from "@/types/product";


interface ProductRowProps {
  product: Product;
}

export default function ProductRow({
  product,
}: ProductRowProps) {

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const isInStock = product.inStock ?? true;

  const [updatingStock, setUpdatingStock] =
    useState(false);

  async function handleToggleStock() {

    setUpdatingStock(true);

    try {

      await updateDoc(
        doc(db, "products", product.id),
        {
          inStock: !isInStock,
        }
      );

      toast.success(
        isInStock
          ? "Marked as out of stock."
          : "Marked as in stock."
      );

    } catch (error) {

      console.error(error);

      toast.error("Failed to update stock status.");

    } finally {

      setUpdatingStock(false);

    }
  }

  async function handleDelete() {

  try {

    await deleteDoc(
      doc(
        db,
        "products",
        product.id
      )
    );

    toast.success(
      "Product deleted successfully!"
    );

    setDeleteOpen(false);

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to delete product."
    );

  }

}

  return (

    <>
    <tr
      className="
        border-t
        hover:bg-slate-50
        transition-colors
      "
    >

      <td className="px-6 py-4">

        {product.imageUrls?.length ? (
        <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="
              h-16
              w-16
              rounded-xl
              object-cover
            "
          />

        ) : (

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-sm
              text-slate-400
            "
          >
            No Image
          </div>

        )}

      </td>

      <td className="px-6 py-4 font-semibold">
        {product.name}
      </td>

      <td className="px-6 py-4">
        {product.category}
      </td>

      <td className="px-6 py-4">
        ₹{product.price}
      </td>

      <td className="px-6 py-4">

        <button
          onClick={handleToggleStock}
          disabled={updatingStock}
          className={`
            rounded-full
            border
            px-3
            py-1.5
            text-xs
            font-semibold
            transition
            disabled:opacity-50

            ${
              isInStock
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            }
          `}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </button>

      </td>

      <td className="px-6 py-4">

        <div
          className="
            flex
            justify-end
            gap-2
          "
        >

          <Link
            href={`/products/${product.slug}`}
            className="
              rounded-xl
              p-3
              transition
              hover:bg-slate-100
            "
          >
            <Eye className="h-5 w-5" />
          </Link>

          <button
            onClick={() =>
              setEditOpen(true)
            }
            className="
              rounded-xl
              p-3
              transition
              hover:bg-blue-100
            "
          >
            <Pencil
              className="
                h-5
                w-5
                text-blue-600
              "
            />
          </button>

          <button
            onClick={() =>
              setDeleteOpen(true)
            }
            className="
              rounded-xl
              p-3
              transition
              hover:bg-red-100
            "
          >
            <Trash2
              className="
                h-5
                w-5
                text-red-600
              "
            />
          </button>

        </div>

      </td>

    </tr>

   

    <EditProductDialog
      open={editOpen}
      onOpenChange={setEditOpen}
      product={product}
    />

    <DeleteProductDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      productName={product.name}
      onDelete={handleDelete}
    />

    </>

  );

}
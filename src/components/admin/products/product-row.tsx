"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import EditProductDialog from "./edit-product-dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface ProductRowProps {
  product: Product;
}

export default function ProductRow({
  product,
}: ProductRowProps) {

  const [open, setOpen] =
    useState(false);

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

        {product.imageUrl ? (

          <img
            src={product.imageUrl}
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

        <div
          className="
            flex
            justify-end
            gap-2
          "
        >

          <button
            className="
              rounded-xl
              p-3
              transition
              hover:bg-slate-100
            "
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
            onClick={() =>
              setOpen(true)
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
      open={open}
      onOpenChange={setOpen}
      product={product}
    />

    </>

  );

}
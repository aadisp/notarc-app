"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Product } from "@/types/product";

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function ViewProductDialog({
  open,
  onOpenChange,
  product,
}: ViewProductDialogProps) {

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className="
          max-w-3xl
        "
      >

        <DialogHeader>

          <DialogTitle>
            Product Details
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-8">

          {product.imageUrl ? (

            <img
              src={product.imageUrl}
              alt={product.name}
              className="
                h-72
                w-full
                rounded-2xl
                object-cover
              "
            />

          ) : (

            <div
              className="
                flex
                h-72
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
              "
            >
              No Image
            </div>

          )}

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="font-semibold">
                {product.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Category
              </p>

              <p className="font-semibold">
                {product.category}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Price
              </p>

              <p className="font-semibold">
                ₹{product.price}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Slug
              </p>

              <p className="font-semibold">
                {product.slug}
              </p>

            </div>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Description
            </p>

            <p className="mt-2 leading-7">
              {product.description || "No description."}
            </p>

          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}
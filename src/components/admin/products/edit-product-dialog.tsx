"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export default function EditProductDialog({
  open,
  onOpenChange,
  product,
}: EditProductDialogProps) {

  const [name, setName] =
    useState(product.name);

  const [slug, setSlug] =
    useState(product.slug);

  const [category, setCategory] =
    useState(product.category);

  const [price, setPrice] =
    useState(product.price);

  const [description,
    setDescription] =
    useState(product.description);

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle>
            Edit Product
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="min-h-36 w-full rounded-xl border p-3"
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button>
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}
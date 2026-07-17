"use client";

import { useEffect, useState } from "react";
import UploadBox from "@/components/admin/upload-box";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { Product } from "@/types/product";

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

  const [newImage, setNewImage] =
    useState<File | null>(null);

  useEffect(() => {
    setName(product.name);
    setSlug(product.slug);
    setCategory(product.category);
    setPrice(product.price);
    setDescription(product.description);
    setNewImage(null);
  }, [product]);

async function handleSave() {

  try {

    let imageUrl = product.imageUrl;

    if (newImage) {
      imageUrl = await uploadToCloudinary(newImage);
    }

    await updateDoc(
      doc(db, "products", product.id),
      {
        name,
        slug,
        category,
        price,
        description,
        imageUrl,
      }
    );

    toast.success(
      "Product updated successfully!"
    );

    setNewImage(null);


    onOpenChange(false);

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to update product."
    );

  }

}

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

          <div className="space-y-3">

          {newImage ? (

            <img
              src={URL.createObjectURL(newImage)}
              alt="New product preview"
              className="
                h-48
                w-full
                rounded-xl
                object-cover
              "
            />

          ) : product.imageUrl ? (

            <img
              src={product.imageUrl}
              alt={product.name}
              className="
                h-48
                w-full
                rounded-xl
                object-cover
              "
            />

          ) : (

            <div
              className="
                flex
                h-48
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-400
              "
            >
              No Image
            </div>

          )}

          <UploadBox
            file={newImage}
            onChange={setNewImage}
            accent="emerald"
            title="Replace Product Image"
          />

        </div>

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

          <Button
            onClick={handleSave}
            >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}
"use client";

import { useEffect, useState } from "react";
import UploadBox from "@/components/admin/upload-box";
import MultiUploadBox from "@/components/admin/multi-upload-box";
import { uploadToCloudinary } from "@/lib/cloudinary";
import ProductForm from "@/components/admin/product-form";
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

  const [
    longDescription,
    setLongDescription,
  ] = useState(product.longDescription);

  const [inStock, setInStock] =
    useState(product.inStock ?? true);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  const [existingImages, setExistingImages] =
    useState<string[]>(product.imageUrls);

  const [existingPublicIds, setExistingPublicIds] =
    useState<string[]>(product.publicIds ?? []);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(product.name);
    setSlug(product.slug);
    setCategory(product.category);
    setPrice(product.price);
    setDescription(product.description);
    setLongDescription(product.longDescription);
    setInStock(product.inStock ?? true);
    setNewImages([]);
    setExistingImages(product.imageUrls);
    setExistingPublicIds(product.publicIds ?? []);
  }, [product]);

function removeExistingImage(index: number) {
    setExistingImages((images) =>
        images.filter((_, i) => i !== index)
    );

    setExistingPublicIds((ids) =>
        ids.filter((_, i) => i !== index)
    );
}

async function handleSave() {
  setSaving(true);
  try {
    let imageUrls = [...existingImages];
    let publicIds = [...existingPublicIds];

    // If the admin selected new images,
    // replace the existing ones.
    for (const file of newImages) {
        const upload = await uploadToCloudinary(file);

        imageUrls.push(upload.imageUrl);
        publicIds.push(upload.publicId);
    }

    await updateDoc(
      doc(db, "products", product.id),
      {
        name,
        slug,
        category,
        price,
        description,
        longDescription,
        imageUrls,
        publicIds,
        inStock,
      }
    );

    toast.success("Product updated successfully!");

    setNewImages([]);

    onOpenChange(false);

  } catch (error) {
    console.error(error);

    toast.error("Failed to update product.");
  }
  finally {

      setSaving(false);

  }
}

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
          className="
              w-[95vw]
              max-w-[95vw]
              h-[90vh]
              overflow-y-auto
          "
      >

        <DialogHeader>

          <DialogTitle>
            Edit Product
          </DialogTitle>

        </DialogHeader>

        <ProductForm
            name={name}
            setName={setName}

            slug={slug}
            setSlug={setSlug}

            category={category}
            setCategory={setCategory}

            price={price.toString()}
            setPrice={(value) => setPrice(Number(value))}

            description={description}
            setDescription={setDescription}
            longDescription={longDescription}
            setLongDescription={setLongDescription}

            inStock={inStock}
            setInStock={setInStock}

            productFiles={newImages}
            setProductFiles={setNewImages}

            onSubmit={handleSave}
            submitText={saving ? "Saving..." : "Save Changes"}
            loading={saving}
            existingImages={existingImages}
            removeExistingImage={removeExistingImage}
        />

      </DialogContent>

    </Dialog>

  );

}
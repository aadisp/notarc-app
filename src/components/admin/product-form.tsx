"use client";

import {
  ShoppingCart,
  Package,
  Tag,
  Link2,
  IndianRupee,
  FileText,
  ImagePlus,
} from "lucide-react";
import FormField from "./form-field";
import AdminInput from "./admin-input";
import UploadBox from "./upload-box";

interface ProductFormProps {
  name: string;
  setName: (v: string) => void;

  slug: string;
  setSlug: (v: string) => void;

  category: string;
  setCategory: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  productFile: File | null;
  setProductFile: (file: File | null) => void;

  onAddProduct: () => void;
  onImportProducts: () => void;
}

export default function ProductForm({
  name,
  setName,
  slug,
  setSlug,
  category,
  setCategory,
  price,
  setPrice,
  description,
  setDescription,
  productFile,
  setProductFile,
  onAddProduct,
  onImportProducts,
}: ProductFormProps) {

  return (

    <section
      id="products"
      className="
        mb-16
        rounded-3xl
        border
        bg-white
        p-8
        shadow-sm
      "
    >

      <div className="mb-8 flex items-center gap-5">

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-emerald-100
          "
        >
          <ShoppingCart
            className="
              h-8
              w-8
              text-emerald-600
            "
          />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            Add Product
          </h2>

          <p className="text-slate-500">
            Create and publish products.
          </p>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <FormField
        label="Product Name"
        icon={Package}
        >

        <AdminInput
            placeholder=""
            value={name}
            onChange={setName}
        />

        </FormField>

        <FormField
        label="Category"
        icon={Tag}
        >

        <AdminInput
            placeholder=""
            value={category}
            onChange={setCategory}
        />

        </FormField>

        <FormField
        label="Slug"
        icon={Link2}
        >

        <AdminInput
            placeholder=""
            value={slug}
            onChange={setSlug}
        />

        </FormField>

        <FormField
        label="Price"
        icon={IndianRupee}
        >

        <AdminInput
            placeholder=""
            value={price}
            onChange={setPrice}
            type="number"
        />

        </FormField>

      </div>

      <div className="mt-6">

        <FormField
        label="Product Image"
        icon={ImagePlus}
        >

        <UploadBox
            file={productFile}
            onChange={setProductFile}
            title="Upload Product Image"
            accent="emerald"
        />

        </FormField>

      </div>

      <FormField
        label="Description"
        icon={FileText}
        >

        <textarea
            placeholder="Write a product description..."
            value={description}
            onChange={(e) =>
            setDescription(e.target.value)
            }
            className="
            min-h-36
            w-full
            resize-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            outline-none
            transition
            focus:border-emerald-500
            focus:bg-white
            focus:ring-4
            focus:ring-emerald-100
            "
        />

        </FormField>

      <div className="mt-8 flex gap-4">

        <button
          onClick={onAddProduct}
          className="
            rounded-xl
            bg-emerald-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-emerald-700
          "
        >
          Add Product
        </button>

        <button
          onClick={onImportProducts}
          className="
            rounded-xl
            border
            border-slate-200
            px-6
            py-3
            font-semibold
            transition
            hover:bg-slate-100
          "
        >
          Import Products
        </button>

      </div>

    </section>

  );

}
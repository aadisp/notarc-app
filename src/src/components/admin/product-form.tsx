"use client";

import {
  Package,
  Tag,
  Link2,
  IndianRupee,
  FileText,
  ImagePlus,
  Trash2,
  PackageCheck,
} from "lucide-react";
import FormField from "./form-field";
import AdminInput from "./admin-input";
import UploadBox from "./upload-box";
import MultiUploadBox from "./multi-upload-box";

interface ProductFormProps {
  name: string;
  setName: (v: string) => void;

  slug?: string;
  setSlug?: (v: string) => void;
  showSlugField?: boolean;

  category: string;
  setCategory: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;
  longDescription: string;
  setLongDescription: (v: string) => void;

  inStock: boolean;
  setInStock: (v: boolean) => void;

  productFiles: File[];
  setProductFiles: (files: File[]) => void;

  onSubmit: () => void;

  submitText?: string;
  existingImages?: string[];
  removeExistingImage?: (index: number) => void;

  loading?: boolean;
}

export default function ProductForm({
  name,
  setName,
  slug,
  setSlug,
  showSlugField = false,
  category,
  setCategory,
  price,
  setPrice,
  description,
  setDescription,
  longDescription,
  setLongDescription,
  inStock,
  setInStock,
  productFiles,
  setProductFiles,
  onSubmit,
  submitText = "Add Product",
  loading = false,
  existingImages = [],
  removeExistingImage = () => {},
}: ProductFormProps) {

  return (

    <div className="space-y-6">

      

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

        {showSlugField && (
          <FormField
          label="Slug"
          icon={Link2}
          >

          <AdminInput
              placeholder=""
              value={slug ?? ""}
              onChange={setSlug ?? (() => {})}
          />

          </FormField>
        )}

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

        <FormField
        label="Availability"
        icon={PackageCheck}
        >

        <button
            type="button"
            role="switch"
            aria-checked={inStock}
            onClick={() => setInStock(!inStock)}
            className={`
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                px-4
                py-3
                transition

                ${
                    inStock
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                }
            `}
        >
            <span
                className={`font-medium ${
                    inStock ? "text-emerald-700" : "text-red-700"
                }`}
            >
                {inStock ? "In Stock" : "Out of Stock"}
            </span>

            <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    inStock ? "bg-emerald-500" : "bg-red-500"
                }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        inStock ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </span>
        </button>

        </FormField>

      </div>

      <div className="mt-6">

      

        <FormField
        label="Product Images"
        icon={ImagePlus}
        >

        <MultiUploadBox
            files={productFiles}
            onChange={setProductFiles}

            existingImages={existingImages}
            removeExistingImage={removeExistingImage}

            title="Upload Product Images"
            accent="emerald"
            maxFiles={10}
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

        <FormField
            label="Long Description"
            icon={FileText}
        >
            <textarea
                placeholder="Write the full product description..."

                value={longDescription}

                onChange={(e) =>
                    setLongDescription(e.target.value)
                }

                className="
                    min-h-60
                    w-full
                    resize-y
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
          onClick={onSubmit}
          disabled={loading}
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
          {loading ? "Adding..." : submitText}
        </button>

        

      </div>

    </div>

  );

}
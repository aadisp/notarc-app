"use client";

import { UploadCloud, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MultiUploadBoxProps {
    files: File[];
    onChange: (files: File[]) => void;

    existingImages?: string[];
    removeExistingImage?: (index: number) => void;

    title: string;
    accent?: "emerald" | "violet";
    maxFiles?: number;
}

export default function MultiUploadBox({
    files,
    onChange,

    existingImages = [],
    removeExistingImage = () => {},

    title,
    accent = "emerald",
    maxFiles = 10,
}: MultiUploadBoxProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const accentColor =
    accent === "emerald"
      ? {
          border: "hover:border-emerald-500",
          bg: "hover:bg-emerald-50",
          icon: "text-emerald-600",
        }
      : {
          border: "hover:border-violet-500",
          bg: "hover:bg-violet-50",
          icon: "text-violet-600",
        };

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    const merged = [...files, ...selected].slice(0, maxFiles);

    onChange(merged);

    e.target.value = "";
  }

  function removeImage(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <label
        className={`
          group
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-3xl
          border-2
          border-dashed
          border-slate-300
          bg-slate-50
          p-10
          text-center
          transition-all
          duration-300
          ${accentColor.border}
          ${accentColor.bg}
        `}
      >
        <input
          hidden
          multiple
          type="file"
          accept="image/*"
          onChange={handleSelect}
        />

        <UploadCloud
          className={`h-14 w-14 transition group-hover:scale-110 ${accentColor.icon}`}
        />

        <h3 className="mt-5 text-lg font-bold">{title}</h3>

        <p className="mt-2 text-sm text-slate-500">
          Select up to {maxFiles} images
        </p>

        <p className="mt-1 text-xs text-slate-400">
          PNG • JPG • WEBP
        </p>
      </label>

      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {existingImages.map((url, index) => (
            <div
                key={`existing-${index}`}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
                <img
                    src={url}
                    className="aspect-square w-full object-cover"
                    alt={`Existing ${index + 1}`}
                />

                <div className="flex items-center justify-between p-3">
                    <p className="truncate text-sm text-slate-500">
                        Existing Image
                    </p>

                    <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="rounded-lg p-2 transition hover:bg-red-50"
                    >
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                </div>
            </div>
        ))}
          {previews.map((preview, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <img
                src={preview}
                className="aspect-square w-full object-cover"
                alt={`Preview ${index + 1}`}
              />

              <div className="flex items-center justify-between p-3">
                <p className="truncate text-sm">
                  {files[index]?.name}
                </p>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-lg p-2 transition hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
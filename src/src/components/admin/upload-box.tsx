"use client";

import { useEffect, useState } from "react";
import {
  ImagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";

interface UploadBoxProps {
  file: File | null;
  onChange: (file: File | null) => void;
  accent?: "emerald" | "violet";
  title: string;
}

export default function UploadBox({
  file,
  onChange,
  accent = "emerald",
  title,
}: UploadBoxProps) {

  const [preview, setPreview] =
    useState<string | null>(null);

  useEffect(() => {

    if (!file) {

      setPreview(null);

      return;

    }

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);

    return () =>
      URL.revokeObjectURL(objectUrl);

  }, [file]);

  const accentColor =
    accent === "emerald"
      ? {
          border:
            "hover:border-emerald-500",
          bg:
            "hover:bg-emerald-50",
          icon:
            "text-emerald-600",
          button:
            "bg-emerald-600 hover:bg-emerald-700",
        }
      : {
          border:
            "hover:border-violet-500",
          bg:
            "hover:bg-violet-50",
          icon:
            "text-violet-600",
          button:
            "bg-violet-600 hover:bg-violet-700",
        };

  return (

    <div className="space-y-4">

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
          type="file"
          accept="image/*"
          onChange={(e) =>
            onChange(
              e.target.files?.[0] || null
            )
          }
        />

        <UploadCloud
          className={`
            h-14
            w-14
            transition
            group-hover:scale-110
            ${accentColor.icon}
          `}
        />

        <h3 className="mt-5 text-lg font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Drag & drop or click to browse
        </p>

        <p className="mt-1 text-xs text-slate-400">
          PNG • JPG • WEBP
        </p>

      </label>

      {preview && (

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            bg-white
            shadow-sm
          "
        >

          <img
            src={preview}
            alt="Preview"
            className="
              h-60
              w-full
              object-cover
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <ImagePlus
                className={accentColor.icon}
              />

              <div>

                <p className="font-medium">
                  {file?.name}
                </p>

                <p className="text-sm text-slate-500">
                  Ready to upload
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                onChange(null)
              }
              className="
                rounded-xl
                border
                p-3
                transition
                hover:bg-red-50
              "
            >

              <Trash2
                className="
                  h-5
                  w-5
                  text-red-500
                "
              />

            </button>

          </div>

        </div>

      )}

    </div>

  );

}
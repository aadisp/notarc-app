"use client";

import {
  Search,
  X,
} from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSearch({
  value,
  onChange,
}: ProductSearchProps) {
  return (
    <div className="relative">

      <Search
        className="
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          py-3
          pl-12
          pr-12
          shadow-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />

      {value && (

        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1.5
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>

      )}

    </div>
  );
}
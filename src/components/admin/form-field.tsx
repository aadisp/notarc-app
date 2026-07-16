"use client";

import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function FormField({
  label,
  icon: Icon,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">

      <label
        className="
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-slate-700
        "
      >

        <Icon
          className="
            h-4
            w-4
            text-slate-500
          "
        />

        {label}

      </label>

      {children}

    </div>
  );
}
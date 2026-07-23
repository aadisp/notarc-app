"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  endIcon?: ReactNode;
}

export default function AuthInput({
  icon,
  endIcon,
  className = "",
  ...props
}: AuthInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-muted-foreground
            pointer-events-none
          "
        >
          {icon}
        </div>
      )}

      <input
        {...props}
        className={`
          h-12
          w-full
          rounded-xl
          border
          border-border
          bg-white/80
          ${icon ? "pl-11" : "pl-4"}
          ${endIcon ? "pr-12" : "pr-4"}
          text-sm
          outline-none
          transition-all
          duration-200
          placeholder:text-muted-foreground
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          ${className}
        `}
      />

      {endIcon && (
        <div
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
          "
        >
          {endIcon}
        </div>
      )}
    </div>
  );
}
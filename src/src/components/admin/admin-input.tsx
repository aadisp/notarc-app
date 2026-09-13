"use client";

interface AdminInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  color?: "emerald" | "violet";
  type?: string;
}

export default function AdminInput({
  placeholder,
  value,
  onChange,
  color = "emerald",
  type = "text",
}: AdminInputProps) {
  const focus =
    color === "emerald"
      ? "focus:border-emerald-500 focus:ring-emerald-100"
      : "focus:border-violet-500 focus:ring-violet-100";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        px-4
        py-3
        outline-none
        transition
        focus:bg-white
        focus:ring-4
        ${focus}
      `}
    />
  );
}
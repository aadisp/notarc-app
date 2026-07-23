interface EnrollmentSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EnrollmentSearch({
  value,
  onChange,
}: EnrollmentSearchProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by course, email or slug..."
      className="
        w-full
        rounded-xl
        border
        bg-white
        px-4
        py-3
        shadow-sm
      "
    />
  );
}
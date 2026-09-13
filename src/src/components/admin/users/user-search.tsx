interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearch({
  value,
  onChange,
}: UserSearchProps) {

  return (

    <input
      placeholder="
        Search username,
        email or role...
      "
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        min-w-[280px]
        flex-1
        rounded-xl
        border
        px-4
        py-3
      "
    />

  );

}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RoleSelect({
  value,
  onChange,
}: RoleSelectProps) {
  return (
    <div>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="admin">
            Admin
          </SelectItem>

          <SelectItem value="user">
            👤 User
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
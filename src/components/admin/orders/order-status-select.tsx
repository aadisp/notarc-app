import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderStatusSelect({
  value,
  onChange,
}: OrderStatusSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Order Status
      </p>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Pending">
            🟡 Pending
          </SelectItem>

          <SelectItem value="Processing">
            🔵 Processing
          </SelectItem>

          <SelectItem value="Shipped">
            🟣 Shipped
          </SelectItem>

          <SelectItem value="Delivered">
            🟢 Delivered
          </SelectItem>

          <SelectItem value="Cancelled">
            🔴 Cancelled
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
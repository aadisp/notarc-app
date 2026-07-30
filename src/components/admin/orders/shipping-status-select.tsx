import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ShippingStatusSelect({
  value,
  onChange,
}: ShippingStatusSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Shipping Status
      </p>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>

          <SelectItem value="Pending">
            🟡 Pending
          </SelectItem>

          <SelectItem value="Processing">
            🔵 Processing
          </SelectItem>

          <SelectItem value="Packed">
            📦 Packed
          </SelectItem>

          <SelectItem value="Shipped">
            🚚 Shipped
          </SelectItem>

          <SelectItem value="Out for Delivery">
            🚛 Out for Delivery
          </SelectItem>

          <SelectItem value="Delivered">
            ✅ Delivered
          </SelectItem>

          <SelectItem value="Cancelled">
            ❌ Cancelled
          </SelectItem>

        </SelectContent>
      </Select>
    </div>
  );
}
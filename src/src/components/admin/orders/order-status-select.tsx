import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types/order";
interface OrderStatusSelectProps {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
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
          <SelectItem value="pending">
            🟡 Pending
        </SelectItem>

        <SelectItem value="processing">
            🔵 Processing
        </SelectItem>

        <SelectItem value="completed">
            🟢 Completed
        </SelectItem>

        <SelectItem value="cancelled">
            🔴 Cancelled
        </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
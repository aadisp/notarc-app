import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PaymentStatusSelect({
  value,
  onChange,
}: PaymentStatusSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Payment Status
      </p>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Pending">
            🟡 Pending
          </SelectItem>

          <SelectItem value="Paid">
            🟢 Paid
          </SelectItem>

          <SelectItem value="Refunded">
            🔴 Refunded
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
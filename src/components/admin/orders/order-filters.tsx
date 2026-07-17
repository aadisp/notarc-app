import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  statusFilter: string;
  paymentFilter: string;

  onStatusChange: (value: string) => void;
  onPaymentChange: (value: string) => void;
}

export default function OrderFilters({
  statusFilter,
  paymentFilter,
  onStatusChange,
  onPaymentChange,
}: OrderFiltersProps) {

  return (

    <>

      <Select
        value={statusFilter}
        onValueChange={onStatusChange}
      >

        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>

          <SelectItem value="All">
            All Statuses
          </SelectItem>

          <SelectItem value="Pending">
            Pending
          </SelectItem>

          <SelectItem value="Processing">
            Processing
          </SelectItem>

          <SelectItem value="Shipped">
            Shipped
          </SelectItem>

          <SelectItem value="Delivered">
            Delivered
          </SelectItem>

          <SelectItem value="Cancelled">
            Cancelled
          </SelectItem>

        </SelectContent>

      </Select>

      <Select
        value={paymentFilter}
        onValueChange={onPaymentChange}
      >

        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>

          <SelectItem value="All">
            All Payments
          </SelectItem>

          <SelectItem value="Pending">
            Pending
          </SelectItem>

          <SelectItem value="Paid">
            Paid
          </SelectItem>

          <SelectItem value="Refunded">
            Refunded
          </SelectItem>

        </SelectContent>

      </Select>

    </>

  );

}
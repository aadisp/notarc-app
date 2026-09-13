import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types/order";
interface OrderFiltersProps {
    statusFilter: OrderStatus | "All";
    onStatusChange: (value: OrderStatus | "All") => void;
}
export default function OrderFilters({
    statusFilter,
    onStatusChange,
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

          <SelectItem value="pending">
            Pending
          </SelectItem>

          <SelectItem value="processing">
            Processing
          </SelectItem>


          <SelectItem value="completed">
            Delivered
          </SelectItem>

          <SelectItem value="cancelled">
            Cancelled
          </SelectItem>

        </SelectContent>

      </Select>

      

    </>

  );

}
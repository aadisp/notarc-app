import type { OrderItem } from "@/types/order";

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({
  items,
}: OrderItemsProps) {
  return (
    <>
      <hr className="my-6" />

      <h3 className="mb-4 font-semibold">
        Items
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between"
          >
            <div>
              <p>{item.name}</p>

              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p>
              ₹
              {item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
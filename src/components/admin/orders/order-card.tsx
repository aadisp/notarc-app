import OrderItems from "./order-items";
import OrderStatusSelect from "./order-status-select";
import PaymentStatusSelect from "./payment-status-select";
import type { Timestamp } from "firebase/firestore";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;

  username: string;
  userEmail: string;

  total: number;

  orderStatus: string;
  paymentStatus: string;

  items: OrderItem[];

  createdAt?: Timestamp;
}

interface OrderCardProps {
  order: Order;

  onOrderStatusChange: (
    orderId: string,
    value: string
  ) => void;

  onPaymentStatusChange: (
    orderId: string,
    value: string
  ) => void;
}

export default function OrderCard({
  order,
  onOrderStatusChange,
  onPaymentStatusChange,
}: OrderCardProps) {

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-8
        shadow-sm
      "
    >

      <div className="flex justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {order.username}
          </h2>

          <p className="text-gray-500">
            {order.userEmail}
          </p>

        </div>

        <div className="text-right">

          <h2 className="text-3xl font-bold">
            ₹{order.total.toLocaleString()}
          </h2>

          <p className="text-sm text-gray-500">
            #{order.id.slice(0, 8)}
          </p>

          {order.createdAt && (
            <p className="mt-1 text-sm text-gray-500">
              {order.createdAt
                .toDate()
                .toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </p>
          )}

        </div>

      </div>

      <div className="mt-6 flex gap-8">

        <OrderStatusSelect
          value={order.orderStatus}
          onChange={(value) =>
            onOrderStatusChange(
              order.id,
              value
            )
          }
        />

        <PaymentStatusSelect
          value={order.paymentStatus}
          onChange={(value) =>
            onPaymentStatusChange(
              order.id,
              value
            )
          }
        />

      </div>

      <OrderItems
        items={order.items}
      />

    </div>

  );

}
import OrderItems from "./order-items";
import OrderStatusSelect from "./order-status-select";
import type {
    Order,
    OrderStatus,
    PaymentStatus,
    ShippingStatus,
} from "@/types/order";
import ShippingStatusSelect from "./shipping-status-select";
import PaymentStatusSelect from "./payment-status-select";

const statusClasses = {
    pending:
        "bg-yellow-100 text-yellow-800",

    processing:
        "bg-blue-100 text-blue-800",

    completed:
        "bg-green-100 text-green-800",

    cancelled:
        "bg-red-100 text-red-800",
};



interface OrderCardProps {
  order: Order;

  onShippingStatusChange: (
      orderId: string,
      value: ShippingStatus
  ) => void;

  onOrderStatusChange: (
    orderId: string,
    value: OrderStatus
  ) => void;

  onPaymentStatusChange: (
    orderId: string,
    value: PaymentStatus
) => void;
}

export default function OrderCard({
    order,
    onOrderStatusChange,
    onPaymentStatusChange,
    onShippingStatusChange,
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

        <div className="flex items-center gap-4">

    <div
        className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-blue-100
            text-lg
            font-bold
            text-blue-700
        "
    >
        {(order.username || order.userEmail)
            .charAt(0)
            .toUpperCase()}
    </div>

    <div>

        <h2 className="text-2xl font-bold">
            {order.username || "Unknown User"}
        </h2>

        <p className="text-gray-500">
            {order.userEmail}
        </p>

    </div>

</div>

        <div className="text-right">

          <span
              className={`
                  inline-block
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  capitalize
                  ${statusClasses[order.status]}
              `}
          >
              {order.status}
          </span>

          <h2 className="mt-3 text-3xl font-bold">
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

      {order.shippingAddress && (
          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
              <p className="font-semibold text-gray-700">
                  Ship to: {order.shippingAddress.fullName}
                  <span className="ml-2 font-normal text-gray-500">
                      {order.shippingAddress.phone}
                  </span>
              </p>
              <p className="mt-0.5 text-gray-600">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2
                      ? `, ${order.shippingAddress.line2}`
                      : ""}
                  , {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  - {order.shippingAddress.pincode}
              </p>
          </div>
      )}

      <div className="mt-6 flex flex-wrap gap-8">

    <OrderStatusSelect
        value={order.status}
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
                value as PaymentStatus
            )
        }
    />

    <ShippingStatusSelect
        value={order.shippingStatus}
        onChange={(value) =>
            onShippingStatusChange(
                order.id,
                value as ShippingStatus
            )
        }
    />

</div>

      {order.paymentReference && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm">
              <span className="font-medium text-blue-800">
                  UPI Reference:
              </span>
              <span className="font-mono text-blue-900">
                  {order.paymentReference}
              </span>
          </div>
      )}

      <OrderItems
        items={order.items}
      />

    </div>

  );

}
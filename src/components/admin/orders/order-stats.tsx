interface OrderStatsProps {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function OrderStats({
  totalOrders,
  totalRevenue,
  pendingOrders,
  completedOrders,
}: OrderStatsProps) {
  return (
    <div
      className="
        mb-10
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Total Orders
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {totalOrders}
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Revenue
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          ₹{totalRevenue.toLocaleString()}
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Pending
        </p>

        <h2 className="mt-2 text-4xl font-bold text-yellow-600">
          {pendingOrders}
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
            Completed
        </p>

        <h2 className="mt-2 text-4xl font-bold text-green-600">
            {completedOrders}
        </h2>
      </div>
    </div>
  );
}
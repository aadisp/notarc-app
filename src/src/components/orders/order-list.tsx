import type { Order } from "@/types/order";
import OrderCard from "./order-card";

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({
    orders,
}: OrderListProps) {

    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed p-12 text-center">
                <h2 className="text-2xl font-semibold">
                    No Orders Yet
                </h2>

                <p className="mt-3 text-muted-foreground">
                    You haven't placed any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                />
            ))}
        </div>
    );
}
import type { Order } from "@/types/order";
import { PackageSearch } from "lucide-react";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({
    order,
}: OrderCardProps) {

    const statusClasses = {
        pending:
            "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",

        paid:
            "bg-green-500/10 text-green-300 border-green-500/30",

        processing:
            "bg-blue-500/10 text-blue-300 border-blue-500/30",

        completed:
            "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",

        cancelled:
            "bg-red-500/10 text-red-300 border-red-500/30",
    };


    const orderDate = order.createdAt
        ? order.createdAt.toDate().toLocaleDateString()
        : "Unknown";
    const statusKey =
        order.status.toLowerCase() as keyof typeof statusClasses;
    
        return (
        <div className="rounded-2xl border bg-card p-8 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-muted-foreground">
                        Order ID
                    </p>

                    <h2 className="font-mono text-lg font-bold">
                        {order.id?.substring(0, 8).toUpperCase()}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {orderDate}
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-sm text-muted-foreground">
                        Total
                    </p>

                    <h2 className="text-3xl font-bold">
                        ₹{order.total}
                    </h2>

                </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

    <span
        className={`rounded-full border px-3 py-1 text-sm font-medium ${
            statusClasses[statusKey] ?? "border"
        }`}
    >
        {order.status}
    </span>

    <span
        className={`rounded-full border px-3 py-1 text-sm font-medium ${
            order.paymentStatus === "Paid"
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : order.paymentStatus === "Refunded"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
        }`}
    >
        {order.paymentStatus}
    </span>

    <span
        className={`rounded-full border px-3 py-1 text-sm font-medium ${
            order.shippingStatus === "Delivered"
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : order.shippingStatus === "Out for Delivery"
                ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                : order.shippingStatus === "Shipped"
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                : order.shippingStatus === "Packed"
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                : order.shippingStatus === "Processing"
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                : order.shippingStatus === "Cancelled"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
        }`}
    >
        {order.shippingStatus}
    </span>

</div>

           

            <hr className="my-6 border-border" />

            <h3 className="mb-4 font-semibold">
                Items
            </h3>

            <div className="space-y-4">

                {order.items.map((item) => (

                    <div
                        key={item.id}
                        className="
                            flex
                            items-center
                            gap-4
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-lg
                                bg-gradient-to-br
                                from-white/[0.06]
                                to-white/[0.02]
                            "
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-1.5"
                                />
                            ) : (
                                <PackageSearch className="h-6 w-6 text-white/30" />
                            )}
                        </div>

                        <div className="flex-1">

                            <p className="font-medium">
                                {item.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                            </p>

                        </div>

                        <p className="font-semibold">
                            ₹{item.price * item.quantity}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );

}
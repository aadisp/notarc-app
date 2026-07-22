import type { Order } from "@/types/order";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({
    order,
}: OrderCardProps) {

    const statusClasses = {
        pending:
            "bg-yellow-100 text-yellow-800 border-yellow-200",

        paid:
            "bg-green-100 text-green-800 border-green-200",

        processing:
            "bg-blue-100 text-blue-800 border-blue-200",

        completed:
            "bg-emerald-100 text-emerald-800 border-emerald-200",

        cancelled:
            "bg-red-100 text-red-800 border-red-200",
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

            <div className="mt-6">

               <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                        statusClasses[statusKey] ?? "border"
                    }`}
                >
                    {order.status}
                </span>

            </div>

            <hr className="my-6" />

            <h3 className="mb-4 font-semibold">
                Items
            </h3>

            <div className="space-y-4">

                {order.items.map((item) => (

                    <div
                        key={item.id}
                        className="flex justify-between"
                    >

                        <div>

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
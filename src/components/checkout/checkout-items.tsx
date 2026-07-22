import type { CartItem } from "@/store/cart-store";

interface CheckoutItemsProps {
    items: CartItem[];
}

export default function CheckoutItems({
    items,
}: CheckoutItemsProps) {
    return (
        <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="
                        rounded-xl
                        border
                        p-6
                    "
                >
                    <div className="flex justify-between">

                        <div>
                            <h2 className="text-xl font-semibold">
                                {item.name}
                            </h2>

                            <p className="text-gray-500">
                                Quantity: {item.quantity}
                            </p>
                        </div>

                        <h2 className="text-xl font-bold">
                            ₹{item.price * item.quantity}
                        </h2>

                    </div>
                </div>
            ))}
        </div>
    );
}
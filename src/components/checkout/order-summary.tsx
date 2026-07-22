interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onPlaceOrder: () => void;
}

export default function OrderSummary({
    subtotal,
    shipping,
    total,
    onPlaceOrder,
}: OrderSummaryProps) {
    return (
        <div
            className="
                h-fit
                rounded-xl
                border
                p-6
            "
        >
            <h2 className="mb-6 text-2xl font-bold">
                Order Summary
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>FREE</span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>
            </div>

            <button
                onClick={onPlaceOrder}
                className="
                    mt-8
                    w-full
                    rounded-lg
                    bg-black
                    py-3
                    text-white
                    transition
                    hover:bg-neutral-800
                "
            >
                Place Order
            </button>
        </div>
    );
}
interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onPlaceOrder: () => void;
    placing?: boolean;
}

export default function OrderSummary({
    subtotal,
    shipping,
    total,
    onPlaceOrder,
    placing = false,
}: OrderSummaryProps) {
    return (
        <div
            className="
                h-fit
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                p-6
                backdrop-blur-sm
            "
        >
            <h2 className="mb-6 text-2xl font-bold text-white">
                Order Summary
            </h2>

            <div className="space-y-3 text-white/70">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">FREE</span>
                </div>

                <hr className="border-white/10" />

                <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
            </div>

            <button
                onClick={onPlaceOrder}
                disabled={placing}
                className="
                    mt-8
                    w-full
                    rounded-lg
                    bg-white
                    py-3
                    font-semibold
                    text-black
                    transition
                    hover:bg-white/90
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                {placing ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
}
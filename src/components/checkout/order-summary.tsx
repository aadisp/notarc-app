import type { PaymentMethodChoice } from "@/hooks/use-checkout";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onPlaceOrder: () => void;
    placing?: boolean;
    canSubmit?: boolean;
    paymentMethod: PaymentMethodChoice;
    onPaymentMethodChange: (method: PaymentMethodChoice) => void;
}

export default function OrderSummary({
    subtotal,
    shipping,
    total,
    onPlaceOrder,
    placing = false,
    canSubmit = true,
    paymentMethod,
    onPaymentMethodChange,
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

            <div className="mt-6">

                <p className="mb-3 text-sm font-medium text-white/70">
                    Payment Method
                </p>

                <div className="grid grid-cols-2 gap-3">

                    <button
                        type="button"
                        onClick={() => onPaymentMethodChange("upi")}
                        className={`
                            rounded-lg
                            border
                            py-3
                            text-sm
                            font-semibold
                            transition
                            ${
                                paymentMethod === "upi"
                                    ? "border-white bg-white text-black"
                                    : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                            }
                        `}
                    >
                        UPI
                    </button>

                    <button
                        type="button"
                        onClick={() => onPaymentMethodChange("cod")}
                        className={`
                            rounded-lg
                            border
                            py-3
                            text-sm
                            font-semibold
                            transition
                            ${
                                paymentMethod === "cod"
                                    ? "border-white bg-white text-black"
                                    : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                            }
                        `}
                    >
                        Pay on Delivery
                    </button>

                </div>

            </div>

            <button
                onClick={onPlaceOrder}
                disabled={placing || !canSubmit}
                className="
                    mt-6
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
                {placing
                    ? "Placing Order..."
                    : !canSubmit
                    ? "Add a Shipping Address"
                    : paymentMethod === "cod"
                    ? "Place Order"
                    : "Place Order"}
            </button>
        </div>
    );
}
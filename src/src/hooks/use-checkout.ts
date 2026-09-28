import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/firebase/firebase";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/store/cart-store";
import type { Product } from "@/types/product";
import type { AddressSelection } from "@/components/checkout/address-selector";

export type PaymentMethodChoice = "upi" | "cod";

interface UseCheckoutProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    products: Product[];
}

export function useCheckout({ items }: UseCheckoutProps) {

    const router = useRouter();
    const [placing, setPlacing] = useState(false);

    const clearCart = useCartStore(
        (state) => state.clearCart
    );

    async function placeOrder(
        addressSelection: AddressSelection | null,
        paymentMethod: PaymentMethodChoice
    ) {

        const user = auth.currentUser;

        if (!user) {
            toast.error("Please login first.");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        if (!addressSelection) {
            toast.error("Please add a shipping address.");
            return;
        }

        setPlacing(true);

        try {

            const idToken = await user.getIdToken();

            const response = await fetch("/api/upi/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                    items: items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                    address:
                        addressSelection.kind === "saved"
                            ? { addressId: addressSelection.addressId }
                            : { newAddress: addressSelection.address },
                    paymentMethod,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Could not place your order.");
                return;
            }

            clearCart();

            // Pay on Delivery has nothing left to collect right now, so
            // there's no QR step — straight to the same confirmation
            // screen the old "no payment at all" flow used to land on.
            // UPI still needs the QR/reference step.
            if (paymentMethod === "cod") {
                router.push("/order-success");
            } else {
                router.push(`/checkout/pay/${data.orderId}`);
            }

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

        } finally {
            setPlacing(false);
        }

    }

    return {
        placeOrder,
        placing,
    };

}

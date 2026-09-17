import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/firebase/firebase";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/store/cart-store";
import type { Product } from "@/types/product";

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

    async function placeOrder() {

        const user = auth.currentUser;

        if (!user) {
            toast.error("Please login first.");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty.");
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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Could not place your order.");
                return;
            }

            clearCart();

            router.push(`/checkout/pay/${data.orderId}`);

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

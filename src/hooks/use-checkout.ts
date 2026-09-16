import { useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { useCartStore } from "@/store/cart-store";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CartItem } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface UseCheckoutProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    products: Product[];
}

export function useCheckout({
    items,
    subtotal,
    shipping,
    total,
    products,
}: UseCheckoutProps) {

    const router = useRouter();

    const clearCart = useCartStore(
        (state) => state.clearCart
    );

    // "summary": reviewing the cart, about to create the order.
    // "payment": order created, showing the UPI QR code.
    const [step, setStep] = useState<"summary" | "payment">("summary");
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [confirmingPayment, setConfirmingPayment] = useState(false);

    // Creates the order (paymentStatus: "Pending") and moves to the
    // payment step. The cart is intentionally NOT cleared yet — if the
    // person abandons the payment step, their cart should still be
    // there when they come back.
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

        setPlacingOrder(true);

        try {

            const userDoc = await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );

            const username =
                userDoc.exists()
                    ? userDoc.data().username
                    : "";

            const orderItems = items.map((item) => {

                const product = products.find(
                    (p) => p.id === item.id
                );

                return {
                    id: item.id,
                    type: "product" as const,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    imageUrl: product?.imageUrls?.[0] ?? null,
                };
            });

            const orderRef = await addDoc(
                collection(
                    db,
                    "orders"
                ),
                {
                    userId: user.uid,
                    username,
                    userEmail: user.email,

                    items: orderItems,

                    subtotal,
                    shipping,
                    total,

                    status: "pending",

                    paymentStatus: "Pending",

                    shippingStatus: "Pending",

                    paymentMethod: "UPI",

                    tax: 0,

                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }
            );

            setPendingOrderId(orderRef.id);
            setStep("payment");

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

        } finally {
            setPlacingOrder(false);
        }

    }

    // Called when the person taps "I've Paid" on the QR screen. Marks
    // the order as awaiting verification — NOT as paid, since nothing
    // here has actually confirmed the money arrived. An admin still
    // needs to check and mark it "Paid" from the orders dashboard.
    async function confirmPayment() {

        if (!pendingOrderId) return;

        setConfirmingPayment(true);

        try {

            await updateDoc(
                doc(db, "orders", pendingOrderId),
                {
                    paymentStatus: "Submitted",
                    updatedAt: serverTimestamp(),
                }
            );

            clearCart();

            toast.success("Payment submitted — we'll confirm it shortly.");

            router.push("/order-success");

        } catch (error) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

        } finally {
            setConfirmingPayment(false);
        }

    }

    return {
        step,
        pendingOrderId,
        placingOrder,
        confirmingPayment,
        placeOrder,
        confirmPayment,
    };

}
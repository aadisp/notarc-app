import { auth, db } from "@/firebase/firebase";
import { useCartStore } from "@/store/cart-store";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CartItem } from "@/store/cart-store";

interface UseCheckoutProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

export function useCheckout({
    items,
    subtotal,
    shipping,
    total,
}: UseCheckoutProps) {

    const router = useRouter();


    const clearCart = useCartStore(
        (state) => state.clearCart
    );

    async function placeOrder() {

        const user = auth.currentUser;

        if (!user) {
            toast.error("Please login first.");
            return;
        }

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

            await addDoc(
                collection(
                    db,
                    "orders"
                ),
                {
                    userId: user.uid,
                    username,
                    userEmail: user.email,
                    items,
                    subtotal,
                    shipping,
                    total,
                    status: "pending",
                    paymentMethod: "Not Specified",
                    tax: 0,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }
            );

            clearCart();

            toast.success(
                "Order placed successfully!"
            );

            router.push("/order-success");

        } catch (error: any) {

            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

        }

    }

    return {
        placeOrder,
    };

}
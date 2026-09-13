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

            await addDoc(
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
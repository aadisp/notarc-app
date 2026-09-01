"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cart-store";

import QuantitySelector from "./quantity-selector";
import ProductActions from "./product-actions";

interface ProductInfoProps {
    id: string;
    name: string;
    category: string;
    description: string;
    longDescription: string;
    price: number;
    slug: string;
}

export default function ProductInfo({
    id,
    name,
    category,
    description,
    longDescription,
    price,
    slug,
}: ProductInfoProps) {

    const router = useRouter();

const { user } = useAuth();

const [quantity, setQuantity] = useState(1);

    const {
        items,
        addItem,
        increaseQuantity,
        decreaseQuantity,
    } = useCartStore();

    const cartItem = useMemo(
        () => items.find(item => item.id === id),
        [items, id]
    );

    function decreaseLocalQuantity() {
        setQuantity(q => Math.max(1, q - 1));
    }

    function increaseLocalQuantity() {
        setQuantity(q => q + 1);
    }

    function handleAddToCart() {

        if (!user) {
    router.push("/login");
    return;
}

        if (cartItem) {

            for (let i = 0; i < quantity; i++) {
                increaseQuantity(id);
            }

            toast.success("Added to cart", {
                description: `${name} (${cartItem.quantity + quantity} in cart)`,
            });

            return;
        }

        addItem({
            id,
            name,
            slug,
            price,
        });

        for (let i = 1; i < quantity; i++) {
            increaseQuantity(id);
        }

        toast.success("Added to cart", {
            description: name,
        });

        setQuantity(1);
    }

    function handleBuyNow() {

    if (!user) {
        router.push("/login");
        return;
    }

    // Only add the product if it isn't already in the cart.
    if (!cartItem) {
        handleAddToCart();
    }

    router.push("/checkout");

}

    return (
        <div>

            <span
                className="
                    inline-flex
                    rounded-full
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-emerald-300
                "
            >
                {category}
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
                {name}
            </h1>

            <p className="mt-6 text-4xl font-bold text-emerald-400">
                ₹{price}
            </p>

            <div className="mt-8 rounded-2xl border bg-white/5 p-6">

                <h2 className="text-lg font-semibold">
                    Description
                </h2>

                <p className="mt-3 text-white/60">
                    {description}
                </p>

                <div className="mt-6 border-t pt-6">

                    <h3 className="text-lg font-semibold">
                        Product Details
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-white/60">
                        {longDescription}
                    </p>

                </div>

            </div>

            <div className="mt-8">

                <QuantitySelector
                    quantity={cartItem ? cartItem.quantity : quantity}
                    onIncrease={
                        cartItem
                            ? () => increaseQuantity(id)
                            : increaseLocalQuantity
                    }
                    onDecrease={
                        cartItem
                            ? () => decreaseQuantity(id)
                            : decreaseLocalQuantity
                    }
                />

            </div>

            <ProductActions
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
            />

        </div>
    );
}
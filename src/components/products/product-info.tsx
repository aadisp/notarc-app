"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

        if (cartItem) {

            for (let i = 0; i < quantity; i++) {
                increaseQuantity(id);
            }

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
        
        setQuantity(1);
    }

    function handleBuyNow() {
        handleAddToCart();
        router.push("/checkout");
    }

    return (
        <div>

            <span
                className="
                    inline-flex
                    rounded-full
                    bg-emerald-100
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-emerald-700
                "
            >
                {category}
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
                {name}
            </h1>

            <p className="mt-6 text-4xl font-bold text-emerald-600">
                ₹{price}
            </p>

            <div className="mt-8 rounded-2xl border bg-slate-50 p-6">

                <h2 className="text-lg font-semibold">
                    Description
                </h2>

                <p className="mt-3 text-slate-600">
                    {description}
                </p>

                <div className="mt-6 border-t pt-6">

                    <h3 className="text-lg font-semibold">
                        Product Details
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
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
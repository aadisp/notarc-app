"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cart-store";

import QuantitySelector from "./quantity-selector";
import ProductActions from "./product-actions";

const LONG_DESCRIPTION_LIMIT = 320;

interface ProductInfoProps {
    id: string;
    name: string;
    category: string;
    description: string;
    longDescription: string;
    price: number;
    slug: string;
    inStock?: boolean;
}

export default function ProductInfo({
    id,
    name,
    category,
    description,
    longDescription,
    price,
    slug,
    inStock = true,
}: ProductInfoProps) {

    const isOutOfStock = !inStock;

    const router = useRouter();
    const { user } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const isLongDescriptionTruncatable =
        longDescription.length > LONG_DESCRIPTION_LIMIT;

    const displayedLongDescription =
        isLongDescriptionTruncatable && !isDescriptionExpanded
            ? longDescription.slice(0, LONG_DESCRIPTION_LIMIT).trimEnd()
            : longDescription;

    const {
        items,
        addItem,
        increaseQuantity,
        decreaseQuantity,
    } = useCartStore();

    const cartItem = useMemo(
        () => items.find((item) => item.id === id),
        [items, id]
    );

    function decreaseLocalQuantity() {
        setQuantity((q) => Math.max(1, q - 1));
    }

    function increaseLocalQuantity() {
        setQuantity((q) => q + 1);
    }

    function handleAddToCart() {

        if (isOutOfStock) return;

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

        addItem({ id, name, slug, price });

        for (let i = 1; i < quantity; i++) {
            increaseQuantity(id);
        }

        toast.success("Added to cart", {
            description: name,
        });

        setQuantity(1);
    }

    function handleBuyNow() {

        if (isOutOfStock) return;

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

            <div className="flex flex-wrap items-center gap-2">

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

                {isOutOfStock && (
                    <span
                        className="
                            inline-flex
                            rounded-full
                            bg-red-500/10
                            px-3
                            py-1
                            text-sm
                            font-medium
                            text-red-400
                        "
                    >
                        Out of Stock
                    </span>
                )}

            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:mt-6 sm:text-4xl lg:text-5xl">
                {name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-emerald-400 sm:mt-6 sm:text-4xl">
                ₹{price.toLocaleString("en-IN")}
            </p>

            <div className="mt-6 rounded-2xl border bg-white/5 p-4 sm:mt-8 sm:p-6">

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
                        {displayedLongDescription}
                        {isLongDescriptionTruncatable && !isDescriptionExpanded && "…"}
                    </p>

                    {isLongDescriptionTruncatable && (
                        <button
                            onClick={() =>
                                setIsDescriptionExpanded((expanded) => !expanded)
                            }
                            className="mt-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                        >
                            {isDescriptionExpanded ? "Read less" : "Read more..."}
                        </button>
                    )}

                </div>

            </div>

            {!isOutOfStock && (
                <div className="mt-6 sm:mt-8">

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
            )}

            <ProductActions
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                disabled={isOutOfStock}
            />

        </div>
    );
}
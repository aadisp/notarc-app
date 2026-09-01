"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
    slug: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    imageUrl?: string;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

export default function CartItemCard({
    slug,
    name,
    price,
    quantity,
    category,
    imageUrl,
    onIncrease,
    onDecrease,
    onRemove,
}: CartItemCardProps) {
    return (
        <div
            className="
                flex
                flex-col
                gap-5
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-white/20
                sm:flex-row
                sm:items-center
            "
        >

            <Link
                href={`/products/${slug}`}
                className="
                    relative
                    aspect-square
                    w-full
                    shrink-0
                    overflow-hidden
                    rounded-xl
                    bg-gradient-to-br
                    from-white/[0.06]
                    to-white/[0.02]
                    sm:w-28
                "
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-contain p-3"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-white/30">
                        <PackageSearch className="h-8 w-8" />
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-2">

                {category && (
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                        {category}
                    </span>
                )}

                <Link
                    href={`/products/${slug}`}
                    className="text-lg font-semibold text-white transition hover:text-emerald-400"
                >
                    {name}
                </Link>

                <p className="text-white/60">
                    ₹{price.toLocaleString("en-IN")}
                </p>

            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">

                <div className="flex items-center rounded-full border border-white/15">

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDecrease}
                        className="h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <span className="w-8 text-center font-semibold text-white">
                        {quantity}
                    </span>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onIncrease}
                        className="h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>

                </div>

                <div className="flex items-center gap-3">

                    <p className="font-semibold text-white">
                        ₹{(price * quantity).toLocaleString("en-IN")}
                    </p>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="h-9 w-9 rounded-full text-white/50 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                </div>

            </div>

        </div>
    );
}
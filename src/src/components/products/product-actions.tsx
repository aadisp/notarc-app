"use client";

import { Button } from "@/components/ui/button";

interface ProductActionsProps {
    onAddToCart: () => void;
    onBuyNow: () => void;
    disabled?: boolean;
}

export default function ProductActions({
    onAddToCart,
    onBuyNow,
    disabled = false,
}: ProductActionsProps) {
    return (
        <div className="mt-6 flex flex-col gap-4 sm:mt-8">

            <Button
                className="h-12 text-base font-semibold"
                onClick={onAddToCart}
                disabled={disabled}
            >
                {disabled ? "Out of Stock" : "Add to Cart"}
            </Button>

            <Button
                variant="outline"
                className="h-12 text-base font-semibold"
                onClick={onBuyNow}
                disabled={disabled}
            >
                Buy Now
            </Button>

        </div>
    );
}
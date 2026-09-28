"use client";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
}: QuantitySelectorProps) {
    return (
        <div className="flex items-center gap-4">
            <span className="font-medium">
                Quantity
            </span>

            <div className="flex items-center rounded-xl border overflow-hidden">

                <Button
                    variant="ghost"
                    onClick={onDecrease}
                    className="rounded-none"
                >
                    −
                </Button>

                <span className="w-14 text-center font-semibold">
                    {quantity}
                </span>

                <Button
                    variant="ghost"
                    onClick={onIncrease}
                    className="rounded-none"
                >
                    +
                </Button>

            </div>
        </div>
    );
}
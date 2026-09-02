"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "./product-categories";

interface ProductFilterPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    selectedCategories: Set<string>;
    onToggleCategory: (category: string) => void;

    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    priceMin: number;
    priceMax: number;

    onClearAll: () => void;

    trigger: React.ReactNode;
}

export default function ProductFilterPanel({
    open,
    onOpenChange,
    selectedCategories,
    onToggleCategory,
    priceRange,
    onPriceRangeChange,
    priceMin,
    priceMax,
    onClearAll,
    trigger,
}: ProductFilterPanelProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>

            <DialogPrimitive.Trigger asChild>
                {trigger}
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>

                <DialogPrimitive.Overlay
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
                />

                <DialogPrimitive.Content
                    className="
                        fixed
                        inset-y-0
                        left-0
                        z-50
                        flex
                        h-full
                        w-[320px]
                        flex-col
                        overflow-y-auto
                        border-r
                        border-white/10
                        bg-[#0b0d10]
                        p-6
                        text-white
                        shadow-2xl
                        outline-none
                        duration-300
                        data-open:animate-in
                        data-open:slide-in-from-left
                        data-closed:animate-out
                        data-closed:slide-out-to-left
                        sm:w-[360px]
                    "
                >

                    <div className="mb-8 flex items-center justify-between">

                        <DialogPrimitive.Title className="text-2xl font-bold text-white">
                            Filters
                        </DialogPrimitive.Title>

                        <DialogPrimitive.Close asChild>
                            <button
                                aria-label="Close filters"
                                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </DialogPrimitive.Close>

                    </div>

                    <div className="space-y-2">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
                            Category
                        </h3>

                        {PRODUCT_CATEGORIES.map((category) => (
                            <label
                                key={category}
                                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5"
                            >
                                <Checkbox
                                    checked={selectedCategories.has(category)}
                                    onCheckedChange={() => onToggleCategory(category)}
                                />
                                <span className="text-sm text-white/90">
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="my-8 border-t border-white/10" />

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
                            Price
                        </h3>

                        <p className="mb-6 text-sm text-white/70">
                            ₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}
                            {priceRange[1] >= priceMax ? "+" : ""}
                        </p>

                        <Slider
                            min={priceMin}
                            max={priceMax}
                            step={Math.max(1, Math.round((priceMax - priceMin) / 100))}
                            value={priceRange}
                            onValueChange={(value) =>
                                onPriceRangeChange(value as [number, number])
                            }
                        />

                        <div className="mt-3 flex justify-between text-xs text-white/40">
                            <span>₹{priceMin.toLocaleString("en-IN")}</span>
                            <span>₹{priceMax.toLocaleString("en-IN")}+</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <Button
                            variant="outline"
                            onClick={onClearAll}
                            className="w-full border-white/25 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-black"
                        >
                            Clear All Filters
                        </Button>
                    </div>

                </DialogPrimitive.Content>

            </DialogPrimitive.Portal>

        </DialogPrimitive.Root>
    );
}
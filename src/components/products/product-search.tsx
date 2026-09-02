"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductFilterPanel from "./product-filter-panel";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;

    selectedCategories: Set<string>;
    onToggleCategory: (category: string) => void;

    filterPanelOpen: boolean;
    onFilterPanelOpenChange: (open: boolean) => void;

    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    priceMin: number;
    priceMax: number;

    onClearAllFilters: () => void;
}

export default function ProductSearch({
    value,
    onChange,
    selectedCategories,
    onToggleCategory,
    filterPanelOpen,
    onFilterPanelOpenChange,
    priceRange,
    onPriceRangeChange,
    priceMin,
    priceMax,
    onClearAllFilters,
}: ProductSearchProps) {

    const activeFilterCount =
        selectedCategories.size +
        (priceRange[0] > priceMin || priceRange[1] < priceMax ? 1 : 0);

    return (
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm backdrop-blur-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                <div className="relative flex-1">

                    <Search
                        className="
                            absolute
                            left-4
                            top-1/2
                            h-5
                            w-5
                            -translate-y-1/2
                            text-white/40
                        "
                    />

                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Search drones, motors, batteries, electronics..."
                        className="h-12 border-white/15 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/40"
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange("")}
                        className="
                            absolute
                            right-1
                            top-1/2
                            -translate-y-1/2
                            text-white/60
                            hover:bg-white/10
                            hover:text-white
                        "
                    >
                        <X className="h-4 w-4" />
                    </Button>

                </div>

                <ProductFilterPanel
                    open={filterPanelOpen}
                    onOpenChange={onFilterPanelOpenChange}
                    selectedCategories={selectedCategories}
                    onToggleCategory={onToggleCategory}
                    priceRange={priceRange}
                    onPriceRangeChange={onPriceRangeChange}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onClearAll={onClearAllFilters}
                    trigger={
                        <Button
                            variant="outline"
                            className="h-12 gap-2 border-white/25 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-black"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    }
                />

            </div>

        </div>
    );
}
"use client";

import ProductSearch from "./product-search";
import ProductCategories from "./product-categories";
import ProductSort from "./product-sort";

interface ProductToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    selectedCategories: Set<string>;
    onToggleCategory: (category: string) => void;
    onClearCategories: () => void;

    sort: string;
    onSortChange: (value: string) => void;

    filterPanelOpen: boolean;
    onFilterPanelOpenChange: (open: boolean) => void;

    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    priceMin: number;
    priceMax: number;

    onClearAllFilters: () => void;
}

export default function ProductToolbar({
    search,
    onSearchChange,
    selectedCategories,
    onToggleCategory,
    onClearCategories,
    sort,
    onSortChange,
    filterPanelOpen,
    onFilterPanelOpenChange,
    priceRange,
    onPriceRangeChange,
    priceMin,
    priceMax,
    onClearAllFilters,
}: ProductToolbarProps) {
    return (
        <div className="mb-10 space-y-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div className="flex-1">
                    <ProductSearch
                        value={search}
                        onChange={onSearchChange}
                        selectedCategories={selectedCategories}
                        onToggleCategory={onToggleCategory}
                        filterPanelOpen={filterPanelOpen}
                        onFilterPanelOpenChange={onFilterPanelOpenChange}
                        priceRange={priceRange}
                        onPriceRangeChange={onPriceRangeChange}
                        priceMin={priceMin}
                        priceMax={priceMax}
                        onClearAllFilters={onClearAllFilters}
                    />
                </div>

                <ProductSort
                    value={sort}
                    onChange={onSortChange}
                />

            </div>

            <ProductCategories
                selected={selectedCategories}
                onToggle={onToggleCategory}
                onClear={onClearCategories}
            />

        </div>
    );
}
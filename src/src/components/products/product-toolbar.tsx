"use client";

import ProductSearch from "./product-search";
import ProductCategories from "./product-categories";
import ProductSort from "./product-sort";
import type { UseProductFiltersResult } from "@/hooks/use-product-filters";

interface ProductToolbarProps {
    catalog: UseProductFiltersResult;
}

export default function ProductToolbar({
    catalog,
}: ProductToolbarProps) {
    return (
        <div className="mb-10 space-y-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div className="flex-1">
                    <ProductSearch catalog={catalog} />
                </div>

                <ProductSort
                    value={catalog.sort}
                    onChange={catalog.setSort}
                />

            </div>

            <ProductCategories
                selected={catalog.selectedCategories}
                onToggle={catalog.toggleCategory}
                onClear={catalog.clearCategories}
            />

        </div>
    );
}
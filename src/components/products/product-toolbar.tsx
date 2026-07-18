"use client";

import ProductSearch from "./product-search";
import ProductCategories from "./product-categories";
import ProductSort from "./product-sort";

interface ProductToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    category: string;
    onCategoryChange: (value: string) => void;

    sort: string;
    onSortChange: (value: string) => void;
}

export default function ProductToolbar({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    sort,
    onSortChange,
}: ProductToolbarProps) {
    return (
        <div className="mb-10 space-y-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div className="flex-1">
                    <ProductSearch
                        value={search}
                        onChange={onSearchChange}
                    />
                </div>

                <ProductSort
                    value={sort}
                    onChange={onSortChange}
                />

            </div>

            <ProductCategories
                selected={category}
                onSelect={onCategoryChange}
            />

        </div>
    );
}
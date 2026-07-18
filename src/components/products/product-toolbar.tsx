"use client";

import ProductSearch from "./product-search";
import ProductCategories from "./product-categories";

interface ProductToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    category: string;
    onCategoryChange: (value: string) => void;
}

export default function ProductToolbar({
    search,
    onSearchChange,
    category,
    onCategoryChange,
}: ProductToolbarProps) {
    return (
        <div className="mb-10 space-y-6">
            <ProductSearch
                value={search}
                onChange={onSearchChange}
            />

            <ProductCategories
                selected={category}
                onSelect={onCategoryChange}
            />
        </div>
    );
}
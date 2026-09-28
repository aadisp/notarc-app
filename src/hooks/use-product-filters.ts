"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";

export type ProductSortOption =
    | "newest"
    | "price-low"
    | "price-high"
    | "name-asc"
    | "name-desc";

export interface UseProductFiltersResult {
    search: string;
    setSearch: (value: string) => void;

    selectedCategories: Set<string>;
    toggleCategory: (category: string) => void;
    clearCategories: () => void;

    sort: ProductSortOption;
    setSort: (value: ProductSortOption) => void;

    priceBounds: [number, number];
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;

    isFilterPanelOpen: boolean;
    setIsFilterPanelOpen: (open: boolean) => void;

    activeFilterCount: number;
    clearAllFilters: () => void;

    filteredProducts: Product[];
}

/**
 * Single source of truth for the products page's search, category,
 * price-range, and sort state, plus the derived filtered/sorted list.
 *
 * Everything the toolbar, filter panel, and grid need lives in the one
 * object this hook returns — pass it straight down instead of drilling
 * a dozen individual props through several component layers.
 */
export function useProductFilters(
    products: Product[]
): UseProductFiltersResult {

    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] =
        useState<Set<string>>(new Set());
    const [sort, setSort] = useState<ProductSortOption>("newest");
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const priceBounds = useMemo<[number, number]>(() => {
        if (products.length === 0) return [0, 0];

        const prices = products.map((product) => product.price);

        return [Math.min(...prices), Math.max(...prices)];
    }, [products]);

    const [priceRange, setPriceRangeState] =
        useState<[number, number]>([0, 0]);
    const [priceTouched, setPriceTouched] = useState(false);

    // Default the price range to the full bounds once real product data
    // has loaded, but only until the person actually moves the slider —
    // after that, refetches shouldn't silently reset their selection.
    useEffect(() => {
        if (!priceTouched) {
            setPriceRangeState(priceBounds);
        }
    }, [priceBounds, priceTouched]);

    function setPriceRange(range: [number, number]) {
        setPriceTouched(true);
        setPriceRangeState(range);
    }

    function toggleCategory(category: string) {
        setSelectedCategories((current) => {
            const next = new Set(current);

            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }

            return next;
        });
    }

    function clearCategories() {
        setSelectedCategories(new Set());
    }

    function clearAllFilters() {
        setSearch("");
        clearCategories();
        setSort("newest");
        setPriceTouched(false);
        setPriceRangeState(priceBounds);
    }

    const activeFilterCount =
        selectedCategories.size +
        (priceTouched &&
        (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1])
            ? 1
            : 0);

    const filteredProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategories.size === 0 ||
                selectedCategories.has(product.category);

            const matchesPrice =
                product.price >= priceRange[0] &&
                product.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesPrice;
        });

        switch (sort) {
            case "price-low":
                return [...filtered].sort((a, b) => a.price - b.price);

            case "price-high":
                return [...filtered].sort((a, b) => b.price - a.price);

            case "name-asc":
                return [...filtered].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );

            case "name-desc":
                return [...filtered].sort((a, b) =>
                    b.name.localeCompare(a.name)
                );

            case "newest":
            default:
                return filtered;
        }
    }, [products, search, selectedCategories, sort, priceRange]);

    return {
        search,
        setSearch,
        selectedCategories,
        toggleCategory,
        clearCategories,
        sort,
        setSort,
        priceBounds,
        priceRange,
        setPriceRange,
        isFilterPanelOpen,
        setIsFilterPanelOpen,
        activeFilterCount,
        clearAllFilters,
        filteredProducts,
    };
}
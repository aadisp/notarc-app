"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductFilterPanel from "./product-filter-panel";
import type { UseProductFiltersResult } from "@/hooks/use-product-filters";

interface ProductSearchProps {
    catalog: UseProductFiltersResult;
}

export default function ProductSearch({
    catalog,
}: ProductSearchProps) {
    return (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-sm backdrop-blur-sm sm:mb-12 sm:p-5">

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
                        value={catalog.search}
                        onChange={(e) => catalog.setSearch(e.target.value)}
                        placeholder="Search drones, motors, batteries, electronics..."
                        className="h-12 border-white/15 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/40"
                    />

                    {catalog.search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => catalog.setSearch("")}
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
                    )}

                </div>

                <Button
                    variant="outline"
                    onClick={() => catalog.setIsFilterPanelOpen(true)}
                    className="relative h-12 gap-2 border-white/25 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-black"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters

                    {catalog.activeFilterCount > 0 && (
                        <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-black">
                            {catalog.activeFilterCount}
                        </span>
                    )}
                </Button>

            </div>

            <ProductFilterPanel catalog={catalog} />

        </div>
    );
}
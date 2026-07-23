"use client";

import ProductCard from "@/components/cards/product-card";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

interface ProductGridProps {
    products: Product[];
    onClearFilters?: () => void;
}

export default function ProductGrid({
    products,
    onClearFilters,
}: ProductGridProps) {

    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">

                <div className="rounded-full bg-primary/10 p-5">
                    <SearchX className="h-10 w-10 text-primary" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                    No products found
                </h2>

                <p className="mt-2 max-w-md text-muted-foreground">
                    We couldn't find any products matching your current search or category.
                </p>

                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={onClearFilters}
                >
                    Clear Filters
                </Button>

            </div>
        );
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    firestoreId={product.id}
                    name={product.name}
                    price={`₹${product.price}`}
                    category={product.category}
                    slug={product.slug}
                    description={product.description}
                    imageUrl={product.imageUrl}
                />
            ))}
        </div>
    );
}
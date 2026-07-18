"use client";

import ProductCard from "@/components/cards/product-card";
import { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({
    products,
}: ProductGridProps) {
    return (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={index + 1}
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
"use client";

import { Product } from "@/types/product";
import ProductCard from "@/components/cards/product-card";

interface RelatedProductsProps {
    currentProductId: string;
    currentCategory: string;
    products: Product[];
}

export default function RelatedProducts({
    currentProductId,
    currentCategory,
    products,
}: RelatedProductsProps) {

    const sameCategory = products.filter(
        (product) =>
            product.id !== currentProductId &&
            product.category === currentCategory
    );

    const others = products.filter(
        (product) =>
            product.id !== currentProductId &&
            product.category !== currentCategory
    );

    const relatedProducts = [
        ...sameCategory,
        ...others,
    ].slice(0, 4);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 sm:mt-24">

            <h2 className="mb-8 text-3xl font-bold">
                Related Products
            </h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">

                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}

            </div>

        </section>
    );
}
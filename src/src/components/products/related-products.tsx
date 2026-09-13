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

            {/* Mobile swipe carousel */}
            <div className="sm:hidden">

                <div
                    className="
                        flex
                        snap-x
                        snap-mandatory
                        gap-4
                        overflow-x-auto
                        overscroll-x-contain
                        pb-4
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >

                    {relatedProducts.map((product) => (

                        <div
                            key={product.id}
                            className="w-[60%] shrink-0 snap-center"
                        >

                            <ProductCard product={product} />

                        </div>

                    ))}

                </div>

            </div>

            {/* Tablet / desktop grid */}
            <div className="hidden grid-cols-3 gap-4 sm:grid lg:grid-cols-4">

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
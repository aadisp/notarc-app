"use client";

import { useEffect, type CSSProperties } from "react";
import RelatedProducts from "@/components/products/related-products";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import type { Product } from "@/types/product";

interface ProductDetailsViewProps {
    product: Product;
    products: Product[];
}

export default function ProductDetailsView({
    product,
    products,
}: ProductDetailsViewProps) {

    // Radix components (Select, Dialog, etc.) portal their popup content to
    // document.body, outside the scoped <div> below. Toggling the `dark`
    // class on <html> ensures those portaled elements also pick up the
    // dark theme variables from globals.css.
    useEffect(() => {
        document.documentElement.classList.add("dark");
        return () => {
            document.documentElement.classList.remove("dark");
        };
    }, []);

    return (
        <div
            className="bg-[#0b0d10] text-white"
            style={{
                "--background": "#0b0d10",
                "--foreground": "#ffffff",
            } as CSSProperties}
        >
            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-2 items-start">

                    <ProductGallery
                        images={product.imageUrls}
                        productName={product.name}
                    />

                    <ProductInfo
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        category={product.category}
                        description={product.description}
                        longDescription={product.longDescription}
                        price={product.price}
                    />

                </div>

                <RelatedProducts
                    currentProductId={product.id}
                    currentCategory={product.category}
                    products={products}
                />

            </section>
        </div>
    );
}
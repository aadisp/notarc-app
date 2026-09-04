"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import RelatedProducts from "@/components/products/related-products";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import { useUserRole } from "@/hooks/use-user-role";
import type { Product } from "@/types/product";

interface ProductDetailsViewProps {
    product: Product;
    products: Product[];
}

export default function ProductDetailsView({
    product,
    products,
}: ProductDetailsViewProps) {

    const role = useUserRole();
    const isAdmin = role === "admin";

    const isTestProduct =
        product.name.trim().toLowerCase() === "test";

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

    const relatedProducts = isAdmin
        ? products
        : products.filter(
              (item) => item.name.trim().toLowerCase() !== "test"
          );

    if (isTestProduct && !isAdmin) {
        return (
            <div
                className="bg-[#0b0d10] text-white"
                style={{
                    "--background": "#0b0d10",
                    "--foreground": "#ffffff",
                } as CSSProperties}
            >
                <section className="mx-auto max-w-3xl px-6 py-32 text-center">

                    <h1 className="text-4xl font-bold">
                        Product Not Found
                    </h1>

                    <p className="mt-4 text-white/60">
                        This product isn't available right now.
                    </p>

                    <Link
                        href="/products"
                        className="mt-8 inline-block text-emerald-400 hover:text-emerald-300"
                    >
                        ← Back to Products
                    </Link>

                </section>
            </div>
        );
    }

    return (
        <div
            className="bg-[#0b0d10] text-white"
            style={{
                "--background": "#0b0d10",
                "--foreground": "#ffffff",
            } as CSSProperties}
        >
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">

                <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">

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
                    products={relatedProducts}
                />

            </section>
        </div>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";
import ProductAdminControls from "./product-admin-controls";

type ProductCardData = Pick<
  Product,
  "id" | "name" | "slug" | "category" | "price" | "description" | "imageUrls"
>;

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, slug, category, description, price, imageUrls } = product;

  const { items, addItem, increaseQuantity, decreaseQuantity } =
    useCartStore();

  const cartItem = items.find((item) => item.id === id);

  const { user } = useAuth();
  const role = useUserRole();
  const isAdmin = role === "admin";
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const hasMultipleImages = (imageUrls?.length ?? 0) > 1;

  function startSlideshow() {
    if (!hasMultipleImages) return;

    slideIntervalRef.current = setInterval(() => {
      setActiveImageIndex(
        (previous) => (previous + 1) % (imageUrls?.length ?? 1)
      );
    }, 1200);
  }

  function stopSlideshow() {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
    setActiveImageIndex(0);
  }

  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    if (!user) {
      router.push("/login");
      return;
    }

    addItem({ id, name, slug, price });

    toast.success("Added to cart", {
      description: name,
    });
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">

      {isAdmin && (
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <ProductAdminControls
            firestoreId={id}
            name={name}
            category={category}
            price={`₹${price}`}
            description={description}
            imageUrl={imageUrls?.[0]}
          />
        </div>
      )}

      {/* Whole image + info block is one click target */}
      <Link
        href={`/products/${slug}`}
        onMouseEnter={startSlideshow}
        onMouseLeave={stopSlideshow}
        className="flex flex-1 flex-col"
      >

        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02]">

          {imageUrls?.length ? (
            <div
              className="flex h-full w-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${activeImageIndex * 100}%)`,
              }}
            >
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${name} ${index + 1}`}
                  className="h-full w-full flex-shrink-0 object-contain p-3"
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30">
              <ImageOff className="h-8 w-8" />
              <span className="text-xs">No Image Available</span>
            </div>
          )}

          {hasMultipleImages && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 gap-1.5 sm:flex">
              {imageUrls!.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    index === activeImageIndex
                      ? "bg-white"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 pb-0">

          <span className="inline-flex w-fit rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white">
            {category}
          </span>

          <h3 className="line-clamp-1 text-sm font-bold tracking-tight text-white transition group-hover:text-emerald-400">
            {name}
          </h3>

          <p className="line-clamp-1 text-xs leading-5 text-white/60">
            {description}
          </p>

        </div>

      </Link>

      <div className="mt-auto p-3 pt-2">

        <p className="mb-2 text-base font-extrabold tracking-tight text-white sm:text-lg">
          ₹{price.toLocaleString("en-IN")}
        </p>

        {cartItem ? (
          <div className="flex h-8 items-center justify-between rounded-full border border-white/15 bg-white/5">

            <Button
              variant="ghost"
              className="h-full flex-1 rounded-full text-sm text-white hover:bg-white/10 hover:text-white"
              onClick={() => decreaseQuantity(id)}
            >
              −
            </Button>

            <span className="w-8 text-center text-sm font-semibold">
              {cartItem.quantity}
            </span>

            <Button
              variant="ghost"
              className="h-full flex-1 rounded-full text-sm text-white hover:bg-white/10 hover:text-white"
              onClick={() => increaseQuantity(id)}
            >
              +
            </Button>

          </div>
        ) : (
          <Button
            className="h-8 w-full rounded-full bg-white text-xs font-semibold text-black hover:bg-white/90"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        )}

      </div>

    </div>
  );
}
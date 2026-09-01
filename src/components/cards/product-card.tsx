"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";
import ProductAdminControls from "./product-admin-controls";

interface ProductCardProps {
  id: string;
  firestoreId: string;
  name: string;
  price: string;
  category: string;
  slug: string;
  description: string;
  imageUrls?: string[];
}

export default function ProductCard({
  id,
  firestoreId,
  name,
  price,
  category,
  slug,
  description,
  imageUrls,
}: ProductCardProps) {

  const {
    items,
    addItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const cartItem = items.find(
    (item) => item.id === id
  );

  const role = useUserRole();
  const { user } = useAuth();

  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasMultipleImages = (imageUrls?.length ?? 0) > 1;

  function startSlideshow() {
    if (!hasMultipleImages) return;

    slideIntervalRef.current = setInterval(() => {
      setActiveImageIndex(
        (previous) => (previous + 1) % (imageUrls?.length ?? 1)
      );
    }, 1000);
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

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">

     <Link
        href={`/products/${slug}`}
        className="relative block aspect-[4/3] cursor-pointer overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
        onMouseEnter={startSlideshow}
        onMouseLeave={stopSlideshow}
      >

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
                      className="h-full w-full flex-shrink-0 object-contain p-6"
                  />
              ))}
          </div>
      ) : (
          <div className="flex h-full items-center justify-center text-white/40">
              <span className="text-sm">
                  No Image Available
              </span>
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

    </Link>

      <div className="flex flex-1 flex-col p-6">

        <div className="space-y-3">

          <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {category}
          </span>

          <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-white">
              {name}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
              {description}
          </p>

      </div>

     

        <div className="mt-auto pt-6">
          <p className="mb-5 text-3xl font-extrabold tracking-tight text-white">
            {price}
          </p>

          <>
            {/* Customer Actions */}
            <div className="flex gap-2">

              <Link href={`/products/${slug}`} className="flex-1">
                <Button
                    variant="outline"
                    className="h-11 w-full rounded-full border-white/25 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                >
                
                  View
                </Button>
              </Link>

              {cartItem ? (
  <div className="flex h-11 flex-1 items-center justify-between rounded-md border border-white/15">

    <Button
      variant="ghost"
      className="h-full px-3 text-white hover:bg-white/10 hover:text-white"
      onClick={() => decreaseQuantity(id)}
    >
      -
    </Button>

    <span className="font-semibold text-white">
      {cartItem.quantity}
    </span>

    <Button
      variant="ghost"
      className="h-full px-3 text-white hover:bg-white/10 hover:text-white"
      onClick={() => increaseQuantity(id)}
    >
      +
    </Button>

  </div>
                ) : (
                  <Button
                    className="h-11 flex-1 bg-white font-semibold text-black hover:bg-white/90"
                    onClick={() => {

                      if (!user) {

                        router.push("/login");

                        return;

                      }

                      addItem({
                        id,
                        name,
                        slug,
                        price: Number(
                          price.replace(/[^\d]/g, "")
                        ),
                      });

                      toast.success("Added to cart", {
                        description: name,
                      });

                    }}
                  >
                    Add to Cart
                  </Button>
                )}

            </div>

            {/* Admin Actions */}
            {role === "admin" && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                <ProductAdminControls
                  firestoreId={firestoreId}
                  name={name}
                  category={category}
                  price={price}
                  description={description}
                />
              </div>
            )}
          </>

        </div>

      </div>
    </div>
  );
}
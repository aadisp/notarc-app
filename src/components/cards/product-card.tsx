"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useUserRole } from "@/hooks/use-user-role";
import ProductAdminControls from "./product-admin-controls";

interface ProductCardProps {
  id: number;
  firestoreId: string;
  name: string;
  price: string;
  category: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export default function ProductCard({
  id,
  firestoreId,
  name,
  price,
  category,
  slug,
  description,
  imageUrl,
}: ProductCardProps) {

  const addItem = useCartStore(
    (state) => state.addItem
  );
  const role = useUserRole();

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

     <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">

      {imageUrl ? (
          <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
      ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-sm">
                  No Image Available
              </span>
          </div>
      )}

    </div>

      <div className="flex flex-1 flex-col p-6">

        <div className="space-y-3">

          <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {category}
          </span>

          <h3 className="line-clamp-2 text-xl font-bold tracking-tight">
              {name}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
          </p>

      </div>

     

        <div className="mt-auto pt-6">
          <p className="mb-5 text-3xl font-extrabold tracking-tight text-primary">
            {price}
          </p>

          <>
            {/* Customer Actions */}
            <div className="flex gap-2">

              <Link href={`/products/${slug}`} className="flex-1">
                <Button
                    variant="outline"
                    className="h-11 w-full"
                >
                
                  View
                </Button>
              </Link>

              <Button
                className="h-11 flex-1 font-semibold"
                onClick={() => {
                  console.log("ADD CLICKED", name);

                  addItem({
                    id,
                    name,
                    price: Number(
                      price.replace(/[^\d]/g, "")
                    ),
                  });

                  console.log(
                    "AFTER ADD",
                    useCartStore.getState().items
                  );
                }}
              >
                Add to Cart
              </Button>

            </div>

            {/* Admin Actions */}
            {role === "admin" && (
              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                <ProductAdminControls
                  firestoreId={firestoreId}
                  name={name}
                  category={category}
                  price={price}
                  description={description}
                  imageUrl={imageUrl}
                />
              </div>
            )}
          </>

        </div>

      </div>
    </div>
  );
}
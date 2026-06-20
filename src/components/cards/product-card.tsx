"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  category: string;
  slug: string;
}

export default function ProductCard({
  id,
  name,
  price,
  category,
  slug,
}: ProductCardProps) {

  const addItem = useCartStore(
    (state) => state.addItem
  );

  return (
    <div className="group overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg">

      <div className="aspect-[4/3] bg-slate-200" />

      <div className="space-y-4 p-6">

        <div>
          <p className="text-sm text-muted-foreground">
            {category}
          </p>

          <h3 className="text-xl font-semibold">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold">
            {price}
          </span>

          <div className="flex gap-2">
            <Link href={`/products/${slug}`}>
              <Button size="sm" variant="outline">
                View
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => {
                console.log("ADD CLICKED", name);

                addItem({
                  id,
                  name,
                  price: Number(
                    price.replace(/[^\d]/g, "")
                  ),
                })

                console.log(
                  "AFTER ADD",
                  useCartStore.getState().items
                );
              }}
            >
              Add
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
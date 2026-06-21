"use client";
import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {

  const items = useCartStore(
    (state) => state.items
  );
  console.log("CART ITEMS:", items);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h1 className="text-5xl font-bold">
          Cart
        </h1>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border p-4"
            >
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p>
                ₹{item.price}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
"use client";
import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {

  const items = useCartStore(
    (state) => state.items
  );

  const increaseQuantity =
    useCartStore(
      (state) =>
        state.increaseQuantity
    );

  const decreaseQuantity =
    useCartStore(
      (state) =>
        state.decreaseQuantity
    );

  const removeItem =
    useCartStore(
      (state) =>
        state.removeItem
    );

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

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

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    decreaseQuantity(item.id)
                  }
                  className="rounded border px-3 py-1"
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                  className="rounded border px-3 py-1"
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
                className="mt-3 rounded border px-3 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border p-6">
          <h2 className="text-2xl font-bold">
            Total: ₹{total}
          </h2>
        </div>
      </section>
    </SiteLayout>
  );
}
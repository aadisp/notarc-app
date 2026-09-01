"use client";
import { useEffect, useMemo, type CSSProperties } from "react";
import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";
import { useProducts } from "@/hooks/use-products";
import { ShoppingCart } from "lucide-react";
import CartItemCard from "@/components/cart/cart-item-card";

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

  const { products } = useProducts();

  const productsById = useMemo(() => {
    const map = new Map(
      products.map((product) => [product.id, product])
    );

    return map;
  }, [products]);

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

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
    <SiteLayout>
      <div
        className="bg-[#0b0d10] text-white"
        style={{
          "--background": "#0b0d10",
          "--foreground": "#ffffff",
        } as CSSProperties}
      >
        <section className="mx-auto max-w-4xl px-6 py-24">
          <h1 className="text-5xl font-bold">
            Cart
          </h1>

          {items.length === 0 ? (

            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-24 text-center">

              <div className="rounded-full bg-white/10 p-5">
                <ShoppingCart className="h-10 w-10 text-white/70" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                Your cart is empty
              </h2>

              <p className="mt-2 max-w-md text-white/50">
                Looks like you haven't added anything to your cart yet.
              </p>

            </div>

          ) : (

            <div className="mt-8 space-y-4">
              {items.map((item) => {

                const product = productsById.get(item.id);

                return (
                  <CartItemCard
                    key={item.id}
                    slug={item.slug}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    category={product?.category}
                    imageUrl={product?.imageUrls?.[0]}
                    onIncrease={() => increaseQuantity(item.id)}
                    onDecrease={() => decreaseQuantity(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                );

              })}
            </div>

          )}

          {items.length > 0 && (

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Total
                </h2>

                <h2 className="text-2xl font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </h2>
              </div>

              <a href="/checkout">
                <button
                  className="
                    mt-6
                    w-full
                    rounded-lg
                    bg-white
                    py-3
                    font-semibold
                    text-black
                    transition
                    hover:bg-neutral-200
                  "
                >
                  Proceed to Checkout
                </button>
              </a>

            </div>

          )}
        </section>
      </div>
    </SiteLayout>
  );
}
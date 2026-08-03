"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutItems from "@/components/checkout/checkout-items";
import { useCheckout } from "@/hooks/use-checkout";


export default function CheckoutPage() {

  const router = useRouter();

  const items = useCartStore(
    (state) => state.items
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const shipping = 0;

  const total =
    subtotal + shipping;

  const { placeOrder } = useCheckout({
      items,
      subtotal,
      shipping,
      total,
  });


  return (
    <SiteLayout>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">

          <CheckoutItems
              items={items}
          />

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onPlaceOrder={placeOrder}
        />

        </div>

      </section>

    </SiteLayout>
  );
}
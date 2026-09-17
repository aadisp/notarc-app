"use client";

import { useMemo, useState } from "react";
import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutItems from "@/components/checkout/checkout-items";
import AddressSelector, {
    AddressSelection,
} from "@/components/checkout/address-selector";
import { useCheckout } from "@/hooks/use-checkout";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types/product";


export default function CheckoutPage() {

  const router = useRouter();

  const items = useCartStore(
    (state) => state.items
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const { products } = useProducts();

  const productsById = useMemo(() => {
    return new Map(
      products.map((product) => [product.id, product])
    );
  }, [products]);

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

  const { placeOrder, placing } = useCheckout({
      items,
      subtotal,
      shipping,
      total,
      products,
  });

  const [addressSelection, setAddressSelection] =
      useState<AddressSelection | null>(null);


  return (
    <SiteLayout>

      <div className="bg-[#0b0d10] text-white">

        <section className="mx-auto max-w-6xl px-6 py-24">

          <h1 className="mb-10 text-5xl font-bold text-white">
            Checkout
          </h1>

          <div className="grid gap-10 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">

              <AddressSelector onSelectionChange={setAddressSelection} />

              <CheckoutItems
                  items={items}
                  productsById={productsById}
              />

          </div>

            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              onPlaceOrder={() => placeOrder(addressSelection)}
              placing={placing}
              canSubmit={addressSelection !== null}
          />

          </div>

        </section>

      </div>

    </SiteLayout>
  );
}
"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useCartStore } from "@/store/cart-store";
import { auth, db } from "@/firebase/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

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

  async function handlePlaceOrder() {

    const user =
      auth.currentUser;

    if (!user) {
      alert(
        "Please login first."
      );
      return;
    }

    try {

      const userDoc =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );

      const username =
        userDoc.exists()
          ? userDoc.data()
              .username
          : "";

      await addDoc(
        collection(
          db,
          "orders"
        ),
        {
          userId: user.uid,
          username,
          userEmail:
            user.email,
          items,
          subtotal,
          shipping,
          total,
          paymentStatus:
            "Pending",
          orderStatus:
            "Pending",
          createdAt:
            serverTimestamp(),
        }
      );

      clearCart();

      alert(
        "Order placed successfully!"
      );

      router.push(
        "/my-orders"
      );

    } catch (error: any) {

      console.error(error);

      alert(error.message);

    }

  }

  return (
    <SiteLayout>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">

          <div className="space-y-4 lg:col-span-2">

            {items.map((item) => (

              <div
                key={item.id}
                className="
                  rounded-xl
                  border
                  p-6
                "
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-gray-500">
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <h2 className="text-xl font-bold">
                    ₹
                    {item.price *
                      item.quantity}
                  </h2>

                </div>

              </div>

            ))}

          </div>

          <div
            className="
              h-fit
              rounded-xl
              border
              p-6
            "
          >

            <h2 className="mb-6 text-2xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  Shipping
                </span>

                <span>
                  FREE
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ₹{total}
                </span>

              </div>

            </div>

            <button
              onClick={
                handlePlaceOrder
              }
              className="
                mt-8
                w-full
                rounded-lg
                bg-black
                py-3
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              Place Order
            </button>

          </div>

        </div>

      </section>

    </SiteLayout>
  );
}
"use client";

import SiteLayout from "@/components/layout/site-layout";
import { auth, db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  total: number;
  subtotal: number;
  shipping: number;

  orderStatus: string;
  paymentStatus: string;

  username: string;
  userEmail: string;

  items: OrderItem[];

  createdAt?: any;
}

export default function MyOrdersPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {

          if (!user) return;

          const ordersQuery =
            query(
              collection(
                db,
                "orders"
              ),
              where(
                "userId",
                "==",
                user.uid
              ),
              orderBy(
                "createdAt",
                "desc"
              )
            );

          const snapshot =
            await getDocs(
              ordersQuery
            );

          const orderList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Order[];

          setOrders(
            orderList
          );
        }
      );

    return () => unsubscribe();

  }, []);

  return (
    <SiteLayout>

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          My Orders
        </h1>

        {orders.length === 0 && (
          <div className="rounded-xl border p-6">
            You haven't placed any orders yet.
          </div>
        )}

        <div className="space-y-6">

            {orders.map((order) => (

            <div
                key={order.id}
                className="rounded-2xl border bg-white p-8 shadow-sm"
            >

                <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                    Order ID
                    </p>

                    <h2 className="font-mono font-bold">
                    {order.id.slice(0, 8).toUpperCase()}
                    </h2>

                </div>

                <div className="text-right">

                    <p className="text-sm text-gray-500">
                    Total
                    </p>

                    <h2 className="text-2xl font-bold">
                    ₹{order.total}
                    </h2>

                </div>

                </div>

                <div className="mt-6 flex gap-6">

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {order.orderStatus}
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {order.paymentStatus}
                </span>

                </div>

                <hr className="my-6" />

                <h3 className="mb-4 font-semibold">
                Items
                </h3>

                <div className="space-y-4">

                {order.items.map((item) => (

                    <div
                    key={item.id}
                    className="flex justify-between"
                    >

                    <div>

                        <p className="font-medium">
                        {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                        </p>

                    </div>

                    <p className="font-semibold">
                        ₹
                        {item.price *
                        item.quantity}
                    </p>

                    </div>

                ))}

                </div>

            </div>

            ))}

        </div>

      </section>

    </SiteLayout>
  );
}
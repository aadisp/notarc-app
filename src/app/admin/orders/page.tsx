"use client";

import OrderCard from "@/components/admin/orders/order-card";
import OrderFilters from "@/components/admin/orders/order-filters";
import OrderSearch from "@/components/admin/orders/order-search";
import OrderStats from "@/components/admin/orders/order-stats";
import SiteLayout from "@/components/layout/site-layout";
import { useUserRole } from "@/hooks/use-user-role";
import { db } from "@/firebase/firebase";
import AdminNav from "@/components/admin/admin-nav";


import {
  collection,
  orderBy,
  query,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types/order";

export default function AdminOrdersPage() {

  const role =
    useUserRole();

  const [orders,
    setOrders] =
    useState<Order[]>([]);
    
  const [loading, setLoading] =
    useState(true);
  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum + order.total,
      0
    );

  const pendingOrders =
    orders.filter(
        (order) =>
            order.status ===
            "pending"
    ).length;

  const completedOrders =
    orders.filter(
        (order) =>
            order.status ===
            "completed"
    ).length;

  const [search,
    setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | "All">("All");

  

  useEffect(() => {

    if (role !== "admin")
      return;

    const q =
      query(
        collection(
          db,
          "orders"
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          const orderList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Order[];

          setOrders(orderList);
          setLoading(false);

        },
        () => {
          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, [role]);

async function updateOrderStatus(
  orderId: string,
  value: OrderStatus
) {
  await updateDoc(
    doc(
      db,
      "orders",
      orderId
    ),
    {
      status: value,
    }
  );

  setOrders((orders) =>
    orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: value,
          }
        : order
    )
  );
}

 
  
  const filteredOrders =
    orders.filter((order) => {

      const matchesSearch =
        (order.username ?? "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        order.userEmail
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        order.id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        order.items.some((item) =>
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      const matchesStatus =
        statusFilter === "All" ||
        order.status ===
          statusFilter;

      

      return (
          matchesSearch &&
          matchesStatus
      );

    });

  if (
    role !== "admin"
  ) {
    return (
      <main className="p-10">
        Access Denied
      </main>
    );
  }

  if (loading) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-center text-lg text-gray-500">
            Loading orders...
          </p>
        </section>
      </SiteLayout>
    );
  }

  return (

    <SiteLayout>

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Orders
        </h1>

        <AdminNav />

        <OrderStats
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            pendingOrders={pendingOrders}
            completedOrders={completedOrders}
        />

        <div
          className="
            mb-8
            flex
            flex-wrap
            gap-4
          "
        >

          <OrderSearch
            value={search}
            onChange={setSearch}
          />

        <OrderFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
        />

        </div>

        <div className="space-y-6">

        {filteredOrders.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-16
              text-center
              shadow-sm
            "
          >

            <h2 className="text-2xl font-semibold">
              No orders found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          filteredOrders.map((order) => (

            <OrderCard
                key={order.id}
                order={order}
                onOrderStatusChange={updateOrderStatus}
            />

          ))

        )}

      </div>

      </section>

    </SiteLayout>

  );

}
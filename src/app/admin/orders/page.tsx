"use client";

import OrderCard from "@/components/admin/orders/order-card";
import OrderItems from "@/components/admin/orders/order-items";
import PaymentStatusSelect from "@/components/admin/orders/payment-status-select";
import OrderStatusSelect from "@/components/admin/orders/order-status-select";
import OrderFilters from "@/components/admin/orders/order-filters";
import OrderSearch from "@/components/admin/orders/order-search";
import OrderStats from "@/components/admin/orders/order-stats";
import SiteLayout from "@/components/layout/site-layout";
import { useUserRole } from "@/hooks/use-user-role";
import { db } from "@/firebase/firebase";



import {
  collection,
  orderBy,
  query,
  doc,
  updateDoc,
  onSnapshot,
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

  username: string;
  userEmail: string;

  total: number;

  orderStatus: string;
  paymentStatus: string;

  items: OrderItem[];

  createdAt?: any;
}

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
        order.orderStatus ===
        "Pending"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "Delivered"
    ).length;

  const [search,
    setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [paymentFilter,
    setPaymentFilter] =
    useState("All");

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
    value: string
  ) {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        orderStatus: value,
      }
    );

    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              orderStatus: value,
            }
          : order
      )
    );

  }

  async function updatePaymentStatus(
    orderId: string,
    value: string
  ) {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        paymentStatus: value,
      }
    );

    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: value,
            }
          : order
      )
    );

  }
  
  const filteredOrders =
    orders.filter((order) => {

      const matchesSearch =
        order.username
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
        order.orderStatus ===
          statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        order.paymentStatus ===
          paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
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

        <OrderStats
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
          pendingOrders={pendingOrders}
          deliveredOrders={deliveredOrders}
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
          paymentFilter={paymentFilter}
          onStatusChange={setStatusFilter}
          onPaymentChange={setPaymentFilter}
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
              onPaymentStatusChange={updatePaymentStatus}
            />

          ))

        )}

      </div>

      </section>

    </SiteLayout>

  );

}
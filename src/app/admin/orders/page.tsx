"use client";

import SiteLayout from "@/components/layout/site-layout";
import { useUserRole } from "@/hooks/use-user-role";
import { db } from "@/firebase/firebase";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

          setOrders(
            orderList
          );

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

  return (

    <SiteLayout>

      <section className="mx-auto max-w-7xl px-6 py-24">

        <h1 className="mb-10 text-5xl font-bold">
          Orders
        </h1>

        <div
          className="
            mb-10
            grid
            gap-6
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {totalOrders}
            </h2>
          </div>

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              ₹
              {totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="mt-2 text-4xl font-bold text-yellow-600">
              {pendingOrders}
            </h2>
          </div>

          <div
            className="
              rounded-2xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h2 className="mt-2 text-4xl font-bold text-green-600">
              {deliveredOrders}
            </h2>
          </div>

        </div>

        <div
          className="
            mb-8
            flex
            flex-wrap
            gap-4
          "
        >

          <input
            placeholder="
              Search username,
              email or order ID...
            "
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              min-w-[280px]
              flex-1
              rounded-xl
              border
              px-4
              py-3
            "
          />

          <Select
            value={statusFilter}
            onValueChange={
              setStatusFilter
            }
          >

            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="All">
                All Statuses
              </SelectItem>

              <SelectItem value="Pending">
                Pending
              </SelectItem>

              <SelectItem value="Processing">
                Processing
              </SelectItem>

              <SelectItem value="Shipped">
                Shipped
              </SelectItem>

              <SelectItem value="Delivered">
                Delivered
              </SelectItem>

              <SelectItem value="Cancelled">
                Cancelled
              </SelectItem>

            </SelectContent>

          </Select>

          <Select
            value={paymentFilter}
            onValueChange={
              setPaymentFilter
            }
          >

            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="All">
                All Payments
              </SelectItem>

              <SelectItem value="Pending">
                Pending
              </SelectItem>

              <SelectItem value="Paid">
                Paid
              </SelectItem>

              <SelectItem value="Refunded">
                Refunded
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        <div className="space-y-6">

          {filteredOrders.map((order) => (

            <div
              key={order.id}
              className="
                rounded-2xl
                border
                bg-white
                p-8
                shadow-sm
              "
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {order.username}
                  </h2>

                  <p className="text-gray-500">
                    {order.userEmail}
                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-3xl font-bold">
                    ₹{order.total}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.id.slice(0, 8)}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex gap-8">

                <div>

                  <p className="mb-2 text-sm text-gray-500">
                    Order Status
                  </p>

                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) =>
                      updateOrderStatus(
                        order.id,
                        value
                      )
                    }
                  >

                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="Pending">
                        🟡 Pending
                      </SelectItem>

                      <SelectItem value="Processing">
                        🔵 Processing
                      </SelectItem>

                      <SelectItem value="Shipped">
                        🟣 Shipped
                      </SelectItem>

                      <SelectItem value="Delivered">
                        🟢 Delivered
                      </SelectItem>

                      <SelectItem value="Cancelled">
                        🔴 Cancelled
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </div>

                <div>

                  <p className="mb-2 text-sm text-gray-500">
                    Payment Status
                  </p>

                  <Select
                    value={order.paymentStatus}
                    onValueChange={(value) =>
                      updatePaymentStatus(
                        order.id,
                        value
                      )
                    }
                  >

                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="Pending">
                        🟡 Pending
                      </SelectItem>

                      <SelectItem value="Paid">
                        🟢 Paid
                      </SelectItem>

                      <SelectItem value="Refunded">
                        🔴 Refunded
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </div>

              </div>

              <hr className="my-6" />

              <h3 className="mb-4 font-semibold">
                Items
              </h3>

              <div className="space-y-3">

                {order.items.map((item) => (

                  <div
                    key={item.id}
                    className="
                      flex
                      justify-between
                    "
                  >

                    <div>

                      <p>
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p>
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
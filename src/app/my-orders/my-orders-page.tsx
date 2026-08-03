"use client";

import SiteLayout from "@/components/layout/site-layout";
import OrderList from "@/components/orders/order-list";
import { useOrders } from "@/hooks/use-orders";

export default function MyOrdersPage() {

    const {
        orders,
        loading,
    } = useOrders();

    return (
        <SiteLayout>

            <section className="mx-auto max-w-7xl px-6 py-16">

                <h1 className="text-5xl font-bold">
                    My Orders
                </h1>

                <p className="mt-4 text-muted-foreground">
                    View the orders you've placed with NOTARC.
                </p>

                <div className="mt-12">

                    {loading ? (

                        <div className="py-20 text-center text-muted-foreground">
                            Loading orders...
                        </div>

                    ) : (

                        <OrderList
                            orders={orders}
                        />

                    )}

                </div>

            </section>

        </SiteLayout>
    );

}
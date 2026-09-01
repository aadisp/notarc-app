"use client";

import { useEffect, type CSSProperties } from "react";
import SiteLayout from "@/components/layout/site-layout";
import OrderList from "@/components/orders/order-list";
import { useOrders } from "@/hooks/use-orders";

export default function MyOrdersPage() {

    const {
        orders,
        loading,
    } = useOrders();

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

                <section className="mx-auto max-w-7xl px-6 py-16">

                    <h1 className="text-5xl font-bold">
                        My Orders
                    </h1>

                    <p className="mt-4 text-white/60">
                        View the orders you've placed with NOTARC.
                    </p>

                    <div className="mt-12">

                        {loading ? (

                            <div className="py-20 text-center text-white/60">
                                Loading orders...
                            </div>

                        ) : (

                            <OrderList
                                orders={orders}
                            />

                        )}

                    </div>

                </section>

            </div>

        </SiteLayout>
    );

}
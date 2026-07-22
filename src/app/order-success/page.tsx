"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">

            <CheckCircle2 className="h-20 w-20 text-green-600" />

            <h1 className="mt-8 text-5xl font-bold">
                Order Placed!
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

                <Link
                    href="/my-orders"
                    className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
                >
                    View My Orders
                </Link>

                <Link
                    href="/products"
                    className="rounded-lg border px-6 py-3 transition hover:bg-muted"
                >
                    Continue Shopping
                </Link>

            </div>

        </main>
    );
}
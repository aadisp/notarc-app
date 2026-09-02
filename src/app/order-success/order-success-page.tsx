"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center bg-[#0b0d10] px-6 text-center">

            <CheckCircle2 className="h-20 w-20 text-green-400" />

            <h1 className="mt-8 text-5xl font-bold text-white">
                Order Placed!
            </h1>

            <p className="mt-4 text-lg text-white/60">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

                <Link
                    href="/my-orders"
                    className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
                >
                    View My Orders
                </Link>

                <Link
                    href="/products"
                    className="rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
                >
                    Continue Shopping
                </Link>

            </div>

        </main>
    );
}
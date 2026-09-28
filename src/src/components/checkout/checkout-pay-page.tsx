"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import QRCode from "qrcode";
import {
    CheckCircle2,
    Copy,
    ExternalLink,
    Loader2,
    XCircle,
} from "lucide-react";
import { auth, db } from "@/firebase/firebase";
import { buildUpiUri, UPI_PAYEE_NAME, UPI_VPA } from "@/lib/upi";
import type { Order } from "@/types/order";

interface Props {
    orderId: string;
}

export default function CheckoutPayPage({ orderId }: Props) {

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [reference, setReference] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Live listener so this page updates the moment an admin marks the
    // order Paid or Rejected, without the buyer needing to refresh.
    useEffect(() => {

        const user = auth.currentUser;

        if (!user) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "orders", orderId),
            (snap) => {

                if (!snap.exists()) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                const data = { id: snap.id, ...snap.data() } as Order;

                if (data.userId !== user.uid) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                setOrder(data);
                setLoading(false);

            },
            (error) => {
                console.error(error);
                setLoading(false);
                setNotFound(true);
            }
        );

        return () => unsubscribe();

    }, [orderId]);

    useEffect(() => {

        if (!order) return;

        const uri = buildUpiUri({
            amount: order.total,
            orderId: order.id,
        });

        QRCode.toDataURL(uri, { margin: 1, width: 280 })
            .then(setQrDataUrl)
            .catch((error) => {
                console.error("QR generation failed:", error);
            });

    }, [order]);

    async function handleSubmitReference(event: React.FormEvent) {

        event.preventDefault();

        if (!order || submitting) return;

        const user = auth.currentUser;
        if (!user) return;

        setSubmitting(true);

        try {

            const idToken = await user.getIdToken();

            const response = await fetch("/api/upi/submit-reference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                    orderId: order.id,
                    reference,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Could not submit that reference.");
                return;
            }

            toast.success("Reference submitted — we'll verify it shortly.");

        } catch (error) {

            console.error(error);
            toast.error("Something went wrong. Please try again.");

        } finally {
            setSubmitting(false);
        }

    }

    function copyVpa() {
        navigator.clipboard.writeText(UPI_VPA).then(() => {
            toast.success("UPI ID copied.");
        });
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
            </div>
        );
    }

    if (notFound || !order) {
        return (
            <div className="mx-auto max-w-md px-6 py-24 text-center text-white/60">
                We couldn&apos;t find that order.
            </div>
        );
    }

    const upiUri = buildUpiUri({ amount: order.total, orderId: order.id });

    return (
        <section className="mx-auto max-w-md px-6 py-16">

            <h1 className="text-center text-3xl font-bold text-white">
                Complete Your Payment
            </h1>

            <p className="mt-2 text-center text-white/60">
                Order #{order.id.slice(0, 8)} · ₹{order.total.toLocaleString("en-IN")}
            </p>

            {order.paymentStatus === "Paid" && (
                <div className="mt-10 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                    <h2 className="mt-4 text-xl font-bold text-white">
                        Payment Verified
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Your payment has been confirmed. Thanks for your order!
                    </p>
                    <Link
                        href="/my-orders"
                        className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
                    >
                        View My Orders
                    </Link>
                </div>
            )}

            {order.paymentStatus === "Submitted" && (
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-white/40" />
                    <h2 className="mt-4 text-xl font-bold text-white">
                        Verifying Your Payment
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        We received your reference{" "}
                        <span className="font-mono text-white">
                            {order.paymentReference}
                        </span>{" "}
                        and are checking it against our bank statement. This
                        page will update automatically once it&apos;s
                        confirmed.
                    </p>
                </div>
            )}

            {(order.paymentStatus === "Pending" ||
                order.paymentStatus === "Rejected") && (
                <>
                    {order.paymentStatus === "Rejected" && (
                        <div className="mt-8 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200">
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            <span>
                                We couldn&apos;t match your last reference to a
                                payment. Double check it and submit again, or
                                pay again below if you haven&apos;t yet.
                            </span>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                        {qrDataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={qrDataUrl}
                                alt="UPI payment QR code"
                                className="h-56 w-56 rounded-lg bg-white p-2"
                            />
                        ) : (
                            <div className="flex h-56 w-56 items-center justify-center rounded-lg bg-white/5">
                                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                            </div>
                        )}

                        <p className="mt-4 text-sm text-white/50">
                            Scan with any UPI app
                        </p>

                        <a
                            href={upiUri}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-white/90"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Pay via UPI App
                        </a>

                        <button
                            type="button"
                            onClick={copyVpa}
                            className="mt-3 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
                        >
                            <Copy className="h-3 w-3" />
                            Or pay manually to {UPI_VPA} ({UPI_PAYEE_NAME})
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmitReference}
                        className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                            UPI Transaction Reference (UTR)
                        </label>
                        <p className="mb-3 text-xs text-white/40">
                            After paying, your UPI app shows a reference
                            number — enter it here so we can confirm your
                            payment.
                        </p>
                        <input
                            required
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. 123456789012"
                            className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting || reference.trim().length === 0}
                            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {submitting ? "Submitting..." : "I've Paid — Submit Reference"}
                        </button>
                    </form>
                </>
            )}

        </section>
    );
}

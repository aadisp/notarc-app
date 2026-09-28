"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

interface UpiQrPaymentProps {
    orderId: string;
    amount: number;
    onConfirmPaid: () => void;
    confirming?: boolean;
}

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "";
const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "NOTARC";

export default function UpiQrPayment({
    orderId,
    amount,
    onConfirmPaid,
    confirming = false,
}: UpiQrPaymentProps) {

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

    // A standard UPI deep link — any UPI app (PhonePe, GPay, Paytm, etc.)
    // can scan or open this. `tn` (transaction note) carries the order
    // id so it shows up in your bank/UPI app statement for matching.
    const upiLink =
        `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
        `&pn=${encodeURIComponent(PAYEE_NAME)}` +
        `&am=${amount}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(`Order ${orderId}`)}`;

    useEffect(() => {

        if (!UPI_ID) {
            setQrError("Payment isn't configured yet. Please contact support.");
            return;
        }

        QRCode.toDataURL(upiLink, { width: 320, margin: 1 })
            .then(setQrDataUrl)
            .catch(() => {
                setQrError("Couldn't generate the QR code. Please refresh and try again.");
            });

    }, [upiLink]);

    return (
        <div
            className="
                h-fit
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                p-6
                text-center
                backdrop-blur-sm
            "
        >
            <h2 className="mb-2 text-2xl font-bold text-white">
                Scan to Pay
            </h2>

            <p className="mb-6 text-3xl font-bold text-white">
                ₹{amount.toLocaleString("en-IN")}
            </p>

            {qrError ? (

                <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {qrError}
                </p>

            ) : qrDataUrl ? (

                <img
                    src={qrDataUrl}
                    alt="UPI payment QR code"
                    className="mx-auto rounded-lg bg-white p-3"
                    width={220}
                    height={220}
                />

            ) : (

                <div className="flex h-[220px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                </div>

            )}

            {UPI_ID && (
                <p className="mt-4 text-sm text-white/50">
                    or pay to <span className="font-mono text-white/70">{UPI_ID}</span>
                </p>
            )}

            {/* Deep link — no-op on desktop browsers, but on a phone this
                opens the person's UPI app directly instead of requiring
                them to scan a QR shown on their own screen. */}
            <a
                href={upiLink}
                className="
                    mt-4
                    block
                    w-full
                    rounded-lg
                    border
                    border-white/25
                    bg-white/5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur-md
                    transition
                    hover:bg-white
                    hover:text-black
                "
            >
                Open in UPI App
            </a>

            <button
                onClick={onConfirmPaid}
                disabled={confirming || !UPI_ID}
                className="
                    mt-3
                    w-full
                    rounded-lg
                    bg-white
                    py-3
                    font-semibold
                    text-black
                    transition
                    hover:bg-white/90
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                {confirming ? "Confirming..." : "I've Paid"}
            </button>

            <p className="mt-4 text-xs leading-5 text-white/40">
                After paying, tap "I've Paid" above. We'll verify the
                payment and confirm your order shortly — you can check its
                status any time under My Orders.
            </p>

        </div>
    );
}
/**
 * A UPI "pay" deep link — not a payment gateway API call. Any UPI app
 * (PhonePe, Google Pay, Paytm, BHIM...) can open this and pre-fill a
 * payment straight to your own UPI ID. There's no confirmation step
 * built into this — see the payment page and /api/upi/submit-reference
 * for how a paid order actually gets marked as such.
 *
 * NEXT_PUBLIC_* env vars because a UPI ID is meant to be shared
 * publicly (it's literally what goes on a printed QR code) — there's
 * nothing here to keep secret.
 */

export const UPI_VPA = process.env.NEXT_PUBLIC_UPI_VPA ?? "";
export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "";

export function isUpiConfigured(): boolean {
    return UPI_VPA.trim().length > 0;
}

interface BuildUpiUriArgs {
    amount: number;
    orderId: string;
    note?: string;
}

/**
 * Builds a `upi://pay?...` URI. `am` pre-fills the amount in the
 * paying app, but — unlike a real payment gateway's "collect
 * request" — nothing stops the payer from editing it before
 * confirming. That's inherent to a plain UPI link with no gateway in
 * the loop; it's why the amount on the order record is what gets
 * checked against the bank statement during manual verification, not
 * something this link can enforce on its own.
 */
export function buildUpiUri({ amount, orderId, note }: BuildUpiUriArgs): string {
    const params = new URLSearchParams({
        pa: UPI_VPA,
        pn: UPI_PAYEE_NAME,
        am: amount.toFixed(2),
        cu: "INR",
        tn: note ?? `Order ${orderId}`,
        tr: orderId,
    });

    return `upi://pay?${params.toString()}`;
}

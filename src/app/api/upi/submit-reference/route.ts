import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

const MAX_REFERENCE_LENGTH = 50;

export async function POST(request: NextRequest) {
    try {
        const { idToken, orderId, reference } = (await request.json()) as {
            idToken: string;
            orderId: string;
            reference: string;
        };

        if (!idToken) {
            return NextResponse.json(
                { error: "Please log in to continue." },
                { status: 401 }
            );
        }

        let uid: string;

        try {
            const decoded = await adminAuth.verifyIdToken(idToken);
            uid = decoded.uid;
        } catch {
            return NextResponse.json(
                { error: "Your session has expired. Please log in again." },
                { status: 401 }
            );
        }

        const cleanReference = (reference ?? "").trim();

        if (!cleanReference) {
            return NextResponse.json(
                { error: "Enter the transaction reference from your UPI app." },
                { status: 400 }
            );
        }

        if (cleanReference.length > MAX_REFERENCE_LENGTH) {
            return NextResponse.json(
                { error: "That reference looks too long — double check it." },
                { status: 400 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: "Missing order." },
                { status: 400 }
            );
        }

        const orderRef = adminDb.collection("orders").doc(orderId);
        const snap = await orderRef.get();

        if (!snap.exists) {
            return NextResponse.json(
                { error: "Order not found." },
                { status: 404 }
            );
        }

        const order = snap.data()!;

        if (order.userId !== uid) {
            return NextResponse.json(
                { error: "This isn't your order." },
                { status: 403 }
            );
        }

        // Allowed from "Pending" (first submission) or "Rejected" (the
        // buyer is correcting a reference an admin couldn't match) —
        // never from "Submitted" (already awaiting review) or "Paid"
        // (already verified), so this can't be used to re-open or
        // tamper with an order that's already settled.
        if (order.paymentStatus !== "Pending" && order.paymentStatus !== "Rejected") {
            return NextResponse.json(
                { error: "This order isn't awaiting a payment reference." },
                { status: 409 }
            );
        }

        await orderRef.update({
            paymentReference: cleanReference,
            paymentStatus: "Submitted",
            updatedAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("upi submit-reference error:", error);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

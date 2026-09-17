import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { buildUpiUri, isUpiConfigured } from "@/lib/upi";

interface RequestedItem {
    id: string;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        const { idToken, items } = (await request.json()) as {
            idToken: string;
            items: RequestedItem[];
        };

        if (!idToken) {
            return NextResponse.json(
                { error: "Please log in to check out." },
                { status: 401 }
            );
        }

        let uid: string;
        let email: string | null;

        try {
            const decoded = await adminAuth.verifyIdToken(idToken);
            uid = decoded.uid;
            email = decoded.email ?? null;
        } catch {
            return NextResponse.json(
                { error: "Your session has expired. Please log in again." },
                { status: 401 }
            );
        }

        if (!isUpiConfigured()) {
            return NextResponse.json(
                { error: "UPI payments aren't configured yet." },
                { status: 500 }
            );
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "Your cart is empty." },
                { status: 400 }
            );
        }

        // Recompute the order total server-side from live Firestore
        // product data — same reasoning as the existing Razorpay route:
        // never trust a client-supplied price.
        let subtotal = 0;
        const orderItems: Array<{
            id: string;
            type: "product";
            name: string;
            quantity: number;
            price: number;
            imageUrl: string | null;
        }> = [];

        for (const item of items) {
            if (!item.id || !item.quantity || item.quantity < 1) {
                return NextResponse.json(
                    { error: "Invalid item in cart." },
                    { status: 400 }
                );
            }

            const productSnap = await adminDb
                .collection("products")
                .doc(item.id)
                .get();

            if (!productSnap.exists) {
                return NextResponse.json(
                    { error: "One of the items in your cart no longer exists." },
                    { status: 400 }
                );
            }

            const product = productSnap.data()!;

            if (product.outOfStock) {
                return NextResponse.json(
                    { error: `"${product.name}" is out of stock.` },
                    { status: 400 }
                );
            }

            const lineTotal = product.price * item.quantity;
            subtotal += lineTotal;

            orderItems.push({
                id: item.id,
                type: "product",
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                imageUrl: product.imageUrls?.[0] ?? null,
            });
        }

        const shipping = 0; // Free shipping, matches existing checkout logic.
        const total = subtotal + shipping;

        if (total <= 0) {
            return NextResponse.json(
                { error: "Order total must be greater than zero." },
                { status: 400 }
            );
        }

        const userSnap = await adminDb.collection("users").doc(uid).get();
        const username = userSnap.data()?.username ?? "";

        const orderRef = await adminDb.collection("orders").add({
            userId: uid,
            username,
            userEmail: email ?? "",

            items: orderItems,

            subtotal,
            shipping,
            total,
            tax: 0,

            status: "pending",

            paymentStatus: "Pending",
            paymentMethod: "UPI",

            shippingStatus: "Pending",

            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        const upiUri = buildUpiUri({
            amount: total,
            orderId: orderRef.id,
        });

        return NextResponse.json({
            orderId: orderRef.id,
            amount: total,
            upiUri,
        });
    } catch (error) {
        console.error("upi create-order error:", error);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

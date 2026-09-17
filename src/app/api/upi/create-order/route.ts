import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { buildUpiUri, isUpiConfigured } from "@/lib/upi";
import type { Address } from "@/types/address";

interface RequestedItem {
    id: string;
    quantity: number;
}

type AddressInput =
    | { addressId: string }
    | { newAddress: Address };

const PHONE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;

function validateNewAddress(address: Address | undefined): string | null {
    if (!address) return "Missing address.";
    if (!address.fullName?.trim()) return "Missing full name.";
    if (!PHONE_PATTERN.test(address.phone ?? "")) return "Invalid phone number.";
    if (!address.line1?.trim()) return "Missing address line 1.";
    if (!address.city?.trim()) return "Missing city.";
    if (!address.state?.trim()) return "Missing state.";
    if (!PINCODE_PATTERN.test(address.pincode ?? "")) return "Invalid pincode.";
    return null;
}

/**
 * Resolves whatever address input the client sent into the address
 * snapshot that gets embedded on the order. For a saved address, this
 * also bumps lastUsedAt so it stays near the top of the buyer's
 * "recent addresses" list. For a brand new address, this creates the
 * saved-address doc so it's available to pick from next time.
 */
async function resolveShippingAddress(
    uid: string,
    input: AddressInput | undefined
): Promise<{ address: Address } | { error: string }> {

    if (!input) {
        return { error: "Please provide a shipping address." };
    }

    if ("addressId" in input) {
        const addressRef = adminDb.collection("addresses").doc(input.addressId);
        const snap = await addressRef.get();

        if (!snap.exists) {
            return { error: "That saved address no longer exists." };
        }

        const data = snap.data()!;

        if (data.userId !== uid) {
            return { error: "That address doesn't belong to you." };
        }

        await addressRef.update({ lastUsedAt: FieldValue.serverTimestamp() });

        const { fullName, phone, line1, line2, city, state, pincode } = data;
        return {
            address: { fullName, phone, line1, line2, city, state, pincode },
        };
    }

    const validationError = validateNewAddress(input.newAddress);
    if (validationError) {
        return { error: validationError };
    }

    const address = input.newAddress;

    await adminDb.collection("addresses").add({
        userId: uid,
        ...address,
        createdAt: FieldValue.serverTimestamp(),
        lastUsedAt: FieldValue.serverTimestamp(),
    });

    return { address };
}

export async function POST(request: NextRequest) {
    try {
        const { idToken, items, address, paymentMethod } =
            (await request.json()) as {
                idToken: string;
                items: RequestedItem[];
                address?: AddressInput;
                paymentMethod?: "upi" | "cod";
            };

        const method: "upi" | "cod" =
            paymentMethod === "cod" ? "cod" : "upi";

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

        // Cash on Delivery doesn't touch UPI at all, so only require it
        // to be configured when it's actually going to be used.
        if (method === "upi" && !isUpiConfigured()) {
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

        const resolvedAddress = await resolveShippingAddress(uid, address);

        if ("error" in resolvedAddress) {
            return NextResponse.json(
                { error: resolvedAddress.error },
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
            paymentMethod: method === "cod" ? "COD" : "UPI",

            shippingStatus: "Pending",

            shippingAddress: resolvedAddress.address,

            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        if (method === "cod") {
            return NextResponse.json({
                orderId: orderRef.id,
                amount: total,
            });
        }

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

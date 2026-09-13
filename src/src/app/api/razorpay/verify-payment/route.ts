import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = (await request.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing payment details." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 500 }
      );
    }

    // This is the actual security check: Razorpay signs
    // "order_id|payment_id" with your secret key. If we can reproduce
    // the exact same signature using our own copy of the secret, the
    // payment genuinely came from Razorpay and wasn't forged by
    // someone just calling this endpoint directly with fake IDs.
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error(
        "Razorpay signature mismatch for order",
        razorpay_order_id
      );

      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Signature is valid. Pull the server-computed order details saved
    // during create-order — never trust item/amount data from the
    // client at this stage either.
    const pendingRef = adminDb
      .collection("pendingOrders")
      .doc(razorpay_order_id);

    const pendingSnap = await pendingRef.get();

    if (!pendingSnap.exists) {
      return NextResponse.json(
        { error: "Order details not found." },
        { status: 404 }
      );
    }

    const pending = pendingSnap.data()!;

    const orderRef = await adminDb.collection("orders").add({
      userId: pending.userId,
      username: pending.username,
      userEmail: pending.userEmail,

      items: pending.items,

      subtotal: pending.subtotal,
      shipping: pending.shipping,
      total: pending.total,

      status: "pending",

      paymentStatus: "Paid",
      paymentMethod: "Razorpay",

      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,

      shippingStatus: "Pending",

      tax: 0,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await pendingRef.delete();

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
    });
  } catch (error) {
    console.error("verify-payment error:", error);

    return NextResponse.json(
      { error: "Something went wrong verifying your payment." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase-admin";

interface RequestedItem {
  id: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, userId, username, userEmail } =
      (await request.json()) as {
        items: RequestedItem[];
        userId: string;
        username: string;
        userEmail: string;
      };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to check out." },
        { status: 401 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 500 }
      );
    }

    // Recompute the order total server-side from live Firestore product
    // data. Never trust a client-supplied amount or price — the browser
    // is not a trusted source, and a tampered request could otherwise
    // pay whatever amount it wants.
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

    const amountInPaise = Math.round(total * 100);

    const authHeader =
      "Basic " +
      Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      }
    );

    if (!razorpayResponse.ok) {
      const errorBody = await razorpayResponse.text();
      console.error("Razorpay order creation failed:", errorBody);

      return NextResponse.json(
        { error: "Could not start payment. Please try again." },
        { status: 502 }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    // Store the server-computed order details keyed by the Razorpay
    // order id, so verify-payment can trust this record instead of
    // re-trusting anything the client sends after payment completes.
    await adminDb
      .collection("pendingOrders")
      .doc(razorpayOrder.id)
      .set({
        userId,
        username: username || "",
        userEmail: userEmail || "",
        items: orderItems,
        subtotal,
        shipping,
        total,
        razorpayOrderId: razorpayOrder.id,
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (error) {
    console.error("create-order error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
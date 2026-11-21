import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

interface StatusInput {
  idToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StatusInput;

    if (!body.idToken) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    let uid: string;

    try {
      const decoded = await adminAuth.verifyIdToken(body.idToken);
      uid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again." },
        { status: 401 }
      );
    }

    const snap = await adminDb
      .collection("rpcEnquiries")
      .doc(uid)
      .get();

    if (!snap.exists) {
      return NextResponse.json({ hasEnquiry: false });
    }

    const data = snap.data();

    return NextResponse.json({
      hasEnquiry: true,
      status: data?.status ?? "new",
    });
  } catch (error) {
    console.error("rpc enquiry-status error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

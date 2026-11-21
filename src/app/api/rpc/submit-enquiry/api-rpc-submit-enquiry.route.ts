import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;
const CATEGORIES = ["small", "medium"] as const;

interface EnquiryInput {
  idToken: string;
  name: string;
  phone: string;
  email: string;
  preferredCategory: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EnquiryInput;

    if (!body.idToken) {
      return NextResponse.json(
        { error: "You must be logged in to submit an enquiry." },
        { status: 401 }
      );
    }

    // Verify the visitor is who they claim to be — never trust a
    // client-supplied userId directly.
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

    // Server-side validation, independent of whatever the client's own
    // form validation already checked — never trust the client alone.
    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const preferredCategory = (body.preferredCategory ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!PHONE_PATTERN.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      !CATEGORIES.includes(
        preferredCategory as (typeof CATEGORIES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Select a training category." },
        { status: 400 }
      );
    }

    // One enquiry per account — the uid is the document id, so a
    // second submission from the same account is rejected rather than
    // silently overwriting the first.
    const enquiryRef = adminDb.collection("rpcEnquiries").doc(uid);
    const existing = await enquiryRef.get();

    if (existing.exists) {
      return NextResponse.json(
        {
          error:
            "You've already submitted an RPC enquiry. Our team will be in touch.",
        },
        { status: 409 }
      );
    }

    await enquiryRef.set({
      userId: uid,
      name,
      phone,
      email,
      preferredCategory,
      message: message || null,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("rpc submit-enquiry error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

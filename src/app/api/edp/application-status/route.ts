import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = (await request.json()) as {
      idToken: string;
    };

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token." },
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

    const existing = await adminDb
      .collection("edpApplications")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    return NextResponse.json({
      hasApplied: !existing.empty,
    });
  } catch (error) {
    console.error("edp application-status error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token.
    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    // Read the user's role from Firestore.
    const userSnapshot =
      await adminDb
        .collection("users")
        .doc(decodedToken.uid)
        .get();

    const role =
      userSnapshot.exists
        ? userSnapshot.data()?.role
        : "user";

    const expiresIn =
      5 * 24 * 60 * 60 * 1000;

    // Create the secure Firebase session cookie.
    const sessionCookie =
      await adminAuth.createSessionCookie(
        idToken,
        {
          expiresIn,
        }
      );

    const response =
      NextResponse.json({
        success: true,
        role,
      });

    response.cookies.set(
      "notarc-session",
      sessionCookie,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge:
          expiresIn / 1000,
      }
    );

    response.cookies.set(
      "notarc-role",
      role === "admin"
        ? "admin"
        : "user",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge:
          expiresIn / 1000,
      }
    );

    return response;

  } catch (error) {

    console.error(
      "Session creation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create session",
      },
      {
        status: 401,
      }
    );
  }
}
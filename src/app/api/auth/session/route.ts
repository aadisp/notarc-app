import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      );
    }

    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    const expiresIn =
      5 * 24 * 60 * 60 * 1000;

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
      });

    response.cookies.set(
      "notarc-session",
      sessionCookie,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
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
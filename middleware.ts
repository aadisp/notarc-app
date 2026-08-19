import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/firebase-admin";

const MAINTENANCE_MODE = true;

export async function middleware(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  // Always allow the maintenance page itself.
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // If maintenance mode is disabled,
  // allow everything normally.
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("notarc-session")?.value;

  // No authenticated session:
  // show maintenance page.
  if (!sessionCookie) {
    const url = request.nextUrl.clone();

    url.pathname = "/maintenance";

    return NextResponse.redirect(url);
  }

  try {
    // Verify the Firebase session cookie.
    const decodedClaims =
      await adminAuth.verifySessionCookie(
        sessionCookie,
        true
      );

    // Check the user's Firestore document.
    const userSnapshot =
      await adminDb
        .collection("users")
        .doc(decodedClaims.uid)
        .get();

    const role =
      userSnapshot.exists
        ? userSnapshot.data()?.role
        : null;

    // Admins can access the entire website
    // while maintenance mode is active.
    if (role === "admin") {
      return NextResponse.next();
    }

    // Authenticated non-admin users still
    // see the maintenance page.
    const url = request.nextUrl.clone();

    url.pathname = "/maintenance";

    return NextResponse.redirect(url);

  } catch (error) {

    console.error(
      "Maintenance middleware authentication error:",
      error
    );

    // Invalid/expired session:
    // treat the visitor as unauthenticated.
    const url = request.nextUrl.clone();

    url.pathname = "/maintenance";

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)",
  ],
};
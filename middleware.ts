import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE_MODE = true;

export function middleware(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  // Authentication pages must remain accessible
  // so users/admins can log in during maintenance.
  if (
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return NextResponse.next();
  }

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

  const roleCookie =
    request.cookies.get("notarc-role")?.value;

  // No authenticated session.
  if (!sessionCookie) {
    const url = request.nextUrl.clone();

    url.pathname = "/maintenance";

    return NextResponse.redirect(url);
  }

  // Admins can access the entire website
  // while maintenance mode is active.
  if (roleCookie === "admin") {
    return NextResponse.next();
  }

  // Authenticated non-admin users still
  // see the maintenance page.
  const url = request.nextUrl.clone();

  url.pathname = "/maintenance";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)",
  ],
};
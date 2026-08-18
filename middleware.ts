import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the maintenance page itself.
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Always allow the admin area.
  // AdminGuard will handle whether the current user
  // is actually an administrator.
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return NextResponse.next();
  }

  // Redirect every other page while maintenance mode is enabled.
  if (MAINTENANCE_MODE) {
    const url = request.nextUrl.clone();

    url.pathname = "/maintenance";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)",
  ],
};
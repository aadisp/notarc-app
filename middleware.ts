import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  // Allow the maintenance page itself.
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Redirect every other page.
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
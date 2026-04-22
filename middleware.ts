import { NextRequest, NextResponse } from "next/server";
import { verifyCookieHeader, SITE_COOKIE_NAME, ADMIN_COOKIE_NAME } from "./lib/auth";

// Paths that don't need the site password (the password page itself, static, API for auth)
const PUBLIC_PATHS = [
  "/password",
  "/api/auth/site",
  "/_next",
  "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ——— Admin routes need admin cookie ———
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // login page & its API are reachable
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth/admin")) {
      return NextResponse.next();
    }
    const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const payload = await verifyCookieHeader(adminCookie);
    if (!payload || payload.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ——— Everything else needs site cookie (except the public paths) ———
  if (isPublic(pathname)) return NextResponse.next();

  const siteCookie = req.cookies.get(SITE_COOKIE_NAME)?.value;
  const payload = await verifyCookieHeader(siteCookie);
  if (!payload) {
    const url = new URL("/password", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

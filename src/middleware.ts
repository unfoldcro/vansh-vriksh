import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const COOKIE_NAME = "vansh-vriksh-token";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/member", "/settings", "/discover"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/verify"];

function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let user: { sub: string; email: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as unknown as { sub: string; email: string; role: string };
    } catch {
      // Invalid token — clear it
      const response = NextResponse.redirect(new URL("/verify", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect routes — redirect to verify if not authenticated
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  // Admin routes — check admin email
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/verify", request.url));
    }
    if (!isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/member/:path*",
    "/settings/:path*",
    "/discover/:path*",
    "/admin/:path*",
    "/verify/:path*",
  ],
};

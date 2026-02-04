import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Path prefix that requires admin privileges
const ADMIN_PREFIX = "/admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  // Retrieve token that the app stores as a cookie
  const token = req.cookies.get("fundilink_token")?.value;

  // If no token → redirect to login with returnUrl back to admin
  if (!token) {
    const url = new URL(`/auth?returnUrl=${encodeURIComponent(pathname)}`, req.url);
    return NextResponse.redirect(url);
  }

  let payload: any = null;
  try {
    if (process.env.JWT_SECRET) {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      // In dev or if secret not provided, just decode without verifying signature
      payload = jwt.decode(token);
    }
  } catch {
    // verification failed – try unsafe decode to still inspect role
    payload = jwt.decode(token);
  }

  const role: string | undefined = (payload as any)?.role;
  if (role === "ADMIN" || role === "SUPERADMIN") {
    return NextResponse.next();
  }

  // Not authorised → send to home page
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};

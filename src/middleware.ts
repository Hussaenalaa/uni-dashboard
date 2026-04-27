import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/unauthorized"];
  if (publicPaths.includes(path)) return NextResponse.next();

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roleRoutes: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    TEACHER: "/dashboard/teacher",
    STUDENT: "/dashboard/student",
    PARENT: "/dashboard/parent",
    STAFF: "/dashboard/staff",
  };

  // block wrong access
  if (path.startsWith("/dashboard")) {
    const allowed = roleRoutes[role];
    if (allowed && !path.startsWith(allowed)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
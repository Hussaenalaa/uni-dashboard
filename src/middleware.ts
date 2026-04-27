import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  // Always allow public paths
  const publicPaths = ["/login", "/unauthorized"];
  if (publicPaths.includes(path)) return NextResponse.next();

  // Redirect unauthenticated users to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role → allowed dashboard base path mapping (matches actual /DashBoard/ casing)
  const roleRoutes: Record<string, string> = {
    ADMIN: "/DashBoard/admin",
    TEACHER: "/DashBoard/teacher",
    STUDENT: "/DashBoard/student",
    PARENT: "/DashBoard/parent",
    STAFF: "/DashBoard/staff",
  };

  // Shared paths all roles can access (lists, etc.)
  const sharedPaths = ["/DashBoard/list"];

  if (path.startsWith("/DashBoard")) {
    const allowed = roleRoutes[role];
    const isShared = sharedPaths.some((p) => path.startsWith(p));

    if (isShared) return NextResponse.next();

    if (allowed && !path.startsWith(allowed)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/DashBoard/:path*", "/login"],
};

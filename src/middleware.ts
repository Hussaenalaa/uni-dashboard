import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/unauthorized"];
  if (publicPaths.includes(path)) return NextResponse.next();

  if (!role) return NextResponse.redirect(new URL("/login", request.url));

  // These paths are accessible to all authenticated roles
  const sharedPaths = [
    "/DashBoard/list/announcements",
    "/DashBoard/list/events",
    "/DashBoard/list/messages",
  ];
  if (sharedPaths.some(p => path.startsWith(p))) return NextResponse.next();

  // Teachers & admins can access teacher detail pages
  if (path.startsWith("/DashBoard/list/teachers")) {
    if (role === "ADMIN" || role === "TEACHER") return NextResponse.next();
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Students, teachers, admins can access student detail pages  
  if (path.startsWith("/DashBoard/list/students")) {
    if (["ADMIN", "TEACHER", "STUDENT", "PARENT"].includes(role)) return NextResponse.next();
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Admin-only list pages
  const adminOnlyPaths = [
    "/DashBoard/list/parents",
    "/DashBoard/list/subjects",
    "/DashBoard/list/classes",
    "/DashBoard/list/lessons",
    "/DashBoard/list/finance",
  ];
  if (adminOnlyPaths.some(p => path.startsWith(p))) {
    if (role === "ADMIN") return NextResponse.next();
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Role dashboard pages
  const roleDashboards: Record<string, string> = {
    ADMIN: "/DashBoard/admin",
    TEACHER: "/DashBoard/teacher",
    STUDENT: "/DashBoard/student",
    PARENT: "/DashBoard/parent",
    STAFF: "/DashBoard/staff",
  };
  if (path.startsWith("/DashBoard")) {
    const myDash = roleDashboards[role];
    if (myDash && path.startsWith(myDash)) return NextResponse.next();
    if (path === "/DashBoard" || path === "/DashBoard/") {
      return NextResponse.redirect(new URL(myDash ?? "/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/DashBoard/:path*", "/login"],
};

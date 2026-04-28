"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

// Paths where the sidebar should be hidden
const NO_SIDEBAR_PATTERNS = [
  /^\/DashBoard\/list\/students\/\d+$/,
  /^\/DashBoard\/list\/teachers\/\d+$/,
];

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const hideSidebar = NO_SIDEBAR_PATTERNS.some((pattern) => pattern.test(pathname));
  if (hideSidebar) return null;
  return <Sidebar />;
}

"use client";

import ConditionalSidebar from "@/components/layout/ConditionalSidebar";
import Topbar from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";

const NO_PADDING_PATTERNS = [
  /^\/DashBoard\/list\/students\/\d+$/,
  /^\/DashBoard\/list\/teachers\/\d+$/,
];

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noPadding = NO_PADDING_PATTERNS.some((p) => p.test(pathname));
  return (
    <div className="flex h-screen overflow-hidden">
      <ConditionalSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className={`bg-gray-50 flex-1 overflow-auto ${noPadding ? "" : "p-4"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
}

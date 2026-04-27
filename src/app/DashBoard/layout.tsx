"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <main className="p-4 bg-gray-50 flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
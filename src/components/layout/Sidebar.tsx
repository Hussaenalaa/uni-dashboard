"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Role = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "STAFF";

const menu: Record<Role, string[]> = {
  ADMIN: ["/DashBoard/admin"],
  TEACHER: ["/DashBoard/teacher"],
  STUDENT: ["/DashBoard/student"],
  PARENT: ["/DashBoard/parent"],
  STAFF: ["/DashBoard/staff"],
};

export default function Sidebar() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <aside className="w-64 bg-white border-r p-4">
        <p className="text-gray-400">Loading...</p>
      </aside>
    );
  }

  if (!user) {
    return (
      <aside className="w-64 bg-white border-r p-4">
        <p className="text-gray-400">Please login</p>
      </aside>
    );
  }

  const role = user.role as Role;

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h1 className="font-bold mb-6">University System</h1>

      <div className="flex flex-col gap-3">
        {menu[role].map((item) => (
          <Link key={item} href={item} className="text-blue-600">
            {item.split("/").pop()}
          </Link>
        ))}
      </div>
    </aside>
  );
}
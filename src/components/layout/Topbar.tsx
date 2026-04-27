"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Role } from "@/types/role";

const roleBadgeColors: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-700",
  TEACHER: "bg-blue-100 text-blue-700",
  STUDENT: "bg-green-100 text-green-700",
  PARENT: "bg-purple-100 text-purple-700",
  STAFF: "bg-yellow-100 text-yellow-700",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent / Guardian",
  STAFF: "Staff",
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full h-14 bg-white border-b flex items-center justify-between px-4 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-64 max-w-xs">
        <Image src="/search.png" alt="Search" width={14} height={14} className="opacity-50" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition">
          <Image src="/announcement.png" alt="Notifications" width={20} height={20} className="opacity-60" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Messages */}
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition">
          <Image src="/message.png" alt="Messages" width={20} height={20} className="opacity-60" />
        </button>

        {user && (
          <>
            {/* User info */}
            <div className="flex flex-col items-end hidden sm:flex">
              <p className="text-sm font-semibold text-gray-800 capitalize leading-tight">{user.username}</p>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${roleBadgeColors[user.role as Role]}`}>
                {roleLabels[user.role as Role]}
              </span>
            </div>

            {/* Avatar */}
            <Image src="/avatar.png" alt="Avatar" width={34} height={34} className="rounded-full border border-gray-200 object-cover" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
            >
              <Image src="/logout.png" alt="Logout" width={14} height={14} className="opacity-70" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

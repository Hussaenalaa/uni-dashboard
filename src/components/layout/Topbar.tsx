"use client";

import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full h-14 bg-white border-b flex items-center justify-between px-4">
      <h1 className="font-semibold">University System</h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-600">
              {user.username} ({user.role})
            </span>

            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
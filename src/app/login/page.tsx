"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/role";
import Image from "next/image";

const DEMO_USERS: { username: string; password: string; role: Role; label: string; redirectId?: number }[] = [
  { username: "admin",    password: "123", role: "ADMIN",   label: "Admin" },
  { username: "teacher",  password: "123", role: "TEACHER", label: "Teacher", redirectId: 1 },
  { username: "teacher2", password: "123", role: "TEACHER", label: "Teacher 2", redirectId: 2 },
  { username: "student",  password: "123", role: "STUDENT", label: "Student", redirectId: 101 },
  { username: "student2", password: "123", role: "STUDENT", label: "Student 2", redirectId: 102 },
  { username: "parent",   password: "123", role: "PARENT",  label: "Parent" },
  { username: "staff",    password: "123", role: "STAFF",   label: "Staff" },
];

function getRoleRedirect(role: Role, redirectId?: number): string {
  switch (role) {
    case "ADMIN":   return "/DashBoard/admin";
    case "TEACHER": return `/DashBoard/list/teachers/${redirectId ?? 1}`;
    case "STUDENT": return `/DashBoard/list/students/${redirectId ?? 101}`;
    case "PARENT":  return "/DashBoard/parent";
    case "STAFF":   return "/DashBoard/staff";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!found) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }
    login(found.username, found.role, found.redirectId);
    await new Promise(r => setTimeout(r, 100));
    router.push(getRoleRedirect(found.role, found.redirectId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="University Logo" width={60} height={60} className="rounded-xl mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">University Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6 text-xs text-blue-700">
          <strong>Demo accounts</strong> — password <code className="bg-blue-100 px-1 rounded">123</code> for all:
          <div className="flex flex-wrap gap-1.5 mt-2">
            {DEMO_USERS.map(u => (
              <button key={u.username} onClick={() => { setUsername(u.username); setPassword("123"); }}
                className="bg-white border border-blue-200 px-2 py-0.5 rounded text-blue-600 hover:bg-blue-100 transition">
                {u.username}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <input type="text" placeholder="e.g. admin" value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="border border-gray-200 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input type="password" placeholder="••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="border border-gray-200 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 transition w-full mt-1">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

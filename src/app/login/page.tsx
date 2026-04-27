"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/role";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // fake validation
    if (username === "admin" && password === "123") {
      login(username, "ADMIN" as Role);
      router.push("/DashBoard/admin");
      return;
    }

    if (username === "teacher" && password === "123") {
      login(username, "TEACHER" as Role);
      router.push("/DashBoard/teacher");
      return;
    }

    if (username === "student" && password === "123") {
      login(username, "STUDENT" as Role);
      router.push("/DashBoard/student");
      return;
    }

    if (username === "parent" && password === "123") {
      login(username, "PARENT" as Role);
      router.push("/DashBoard/parent");
      return;
    }

    if (username === "staff" && password === "123") {
      login(username, "STAFF" as Role);
      router.push("/DashBoard/staff");
      return;
    }

    alert("Invalid credentials");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 border rounded w-80">
        <h1 className="text-xl mb-4">University System Login</h1>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
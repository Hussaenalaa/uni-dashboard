"use client";

import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/role";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: Role;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== role) {
      router.push("/unauthorized");
    }
  }, [user]);

  if (!user || user.role !== role) return null;

  return <>{children}</>;
}
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "@/types/role";

type User = { username: string; role: Role; profileId?: number } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (username: string, role: Role, profileId?: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}`;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("uni_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setCookie("role", parsed.role);
      setCookie("username", parsed.username);
      if (parsed.profileId) setCookie("profileId", String(parsed.profileId));
    }
    setLoading(false);
  }, []);

  const login = (username: string, role: Role, profileId?: number) => {
    const newUser = { username, role, profileId };
    setUser(newUser);
    localStorage.setItem("uni_user", JSON.stringify(newUser));
    setCookie("role", role);
    setCookie("username", username);
    if (profileId) setCookie("profileId", String(profileId));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("uni_user");
    deleteCookie("role");
    deleteCookie("username");
    deleteCookie("profileId");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

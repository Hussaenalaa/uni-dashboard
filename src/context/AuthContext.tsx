"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "@/types/role";

type User = {
  username: string;
  role: Role;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (username: string, role: Role) => void;
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
      // Sync cookies so middleware can read the session
      setCookie("role", parsed.role);
      setCookie("username", parsed.username);
    }
    setLoading(false);
  }, []);

  const login = (username: string, role: Role) => {
    const newUser = { username, role };
    setUser(newUser);
    localStorage.setItem("uni_user", JSON.stringify(newUser));
    // Set cookies for middleware-level route protection
    setCookie("role", role);
    setCookie("username", username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("uni_user");
    deleteCookie("role");
    deleteCookie("username");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

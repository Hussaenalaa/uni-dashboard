import { Role } from "@/types/role";

export const users = [
  { username: "admin", password: "123", role: "ADMIN" },
  { username: "teacher", password: "123", role: "TEACHER" },
  { username: "student", password: "123", role: "STUDENT" },
  { username: "parent", password: "123", role: "PARENT" },
  { username: "staff", password: "123", role: "STAFF" },
];

export function login(username: string, password: string) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return null;

  // store in cookie (for middleware access)
  document.cookie = `role=${user.role}; path=/`;
  document.cookie = `username=${user.username}; path=/`;

  return user;
}

export function logout() {
  document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
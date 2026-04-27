import { cookies } from "next/headers";
import { Role } from "@/types/role";

/**
 * Read the current user's role from the cookie (server components only).
 * Falls back to "STUDENT" if no cookie is set.
 */
export async function getServerRole(): Promise<Role> {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value as Role | undefined;
  return role ?? "STUDENT";
}

/**
 * Convenience check — is the current server-side user an admin?
 */
export async function isAdmin(): Promise<boolean> {
  return (await getServerRole()) === "ADMIN";
}

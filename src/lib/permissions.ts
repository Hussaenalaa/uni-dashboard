import { Role } from "@/types/role";

export const permissions: Record<Role, string[]> = {
  ADMIN: ["*"],
  TEACHER: ["dashboard/teacher", "courses", "students"],
  STUDENT: ["dashboard/student", "grades", "schedule"],
  parent: ["dashboard/parent", "child-progress"],
  STAFF: ["dashboard/staff", "reports"],
};

export function canAccess(role: Role, path: string) {
  const allowed = permissions[role];

  if (allowed.includes("*")) return true;

  return allowed.some((p) => path.includes(p));
}
import { Role } from "@/types/role";

export const permissions: Record<Role, string[]> = {
  ADMIN: ["*"],
  TEACHER: ["DashBoard/teacher", "DashBoard/list/students", "DashBoard/list/lessons", "DashBoard/list/exams", "DashBoard/list/assignments", "DashBoard/list/results", "DashBoard/list/attendance"],
  STUDENT: ["DashBoard/student", "DashBoard/list/results", "DashBoard/list/assignments", "DashBoard/list/exams", "DashBoard/list/events", "DashBoard/list/announcements"],
  PARENT: ["DashBoard/parent", "DashBoard/list/results", "DashBoard/list/events", "DashBoard/list/announcements"],
  STAFF: ["DashBoard/staff", "DashBoard/list/events", "DashBoard/list/announcements"],
};

export function canAccess(role: Role, path: string) {
  const allowed = permissions[role];
  if (allowed.includes("*")) return true;
  return allowed.some((p) => path.includes(p));
}

import { Role } from "@/types/role";

export function canAccess(userRole: Role, pageRole: Role) {
  return userRole === pageRole;
}
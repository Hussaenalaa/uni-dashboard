// ─── Shared announcement store ───────────────────────────────────────────────
// Uses a simple module-level mutable array as an in-memory store.
// In production this would be a database / API call.

import {
  announcements as seedAnnouncements,
  type Announcement,
} from "@/lib/university-data";

let _announcements: Announcement[] = [...seedAnnouncements];
let _nextId = Math.max(..._announcements.map((a) => a.id)) + 1;

export function getAllAnnouncements(): Announcement[] {
  return [..._announcements].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export function addAnnouncement(a: Omit<Announcement, "id" | "sentAt">): Announcement {
  const newA: Announcement = {
    ...a,
    id: _nextId++,
    sentAt: new Date().toISOString(),
  };
  _announcements = [newA, ..._announcements];
  return newA;
}

export function deleteAnnouncement(id: number) {
  _announcements = _announcements.filter((a) => a.id !== id);
}

export function getAnnouncementsForStudent(year: number, department: string): Announcement[] {
  return getAllAnnouncements().filter(
    (a) =>
      // admin-wide: no target at all
      (!a.targetYear && !a.targetDepartment) ||
      // department-wide
      (!a.targetYear && a.targetDepartment === department) ||
      // year-wide, any dept
      (a.targetYear === year && !a.targetDepartment) ||
      // exact match
      (a.targetYear === year && a.targetDepartment === department)
  );
}

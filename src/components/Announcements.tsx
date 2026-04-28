"use client";

import { useEffect, useState } from "react";
import { getAllAnnouncements, type Announcement } from "@/lib/announcement-store";

const COLORS = [
  "bg-sky-50 border-sky-200",
  "bg-purple-50 border-purple-200",
  "bg-emerald-50 border-emerald-200",
  "bg-amber-50 border-amber-200",
];

const typeIcon: Record<string, string> = {
  "teacher-1": "👨‍🏫",
  "admin": "🏛",
};

export default function Announcements({
  targetYear,
  targetDepartment,
  limit = 5,
}: {
  targetYear?: number;
  targetDepartment?: string;
  limit?: number;
}) {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    const all = getAllAnnouncements();
    const filtered = all.filter((a) => {
      if (!targetYear && !targetDepartment) return true;
      if (a.targetYear && targetYear && a.targetYear !== targetYear) return false;
      if (a.targetDepartment && targetDepartment && a.targetDepartment !== targetDepartment) return false;
      return true;
    });
    setItems(filtered.slice(0, limit));
  }, [targetYear, targetDepartment, limit]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">Announcements</h2>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6">No announcements yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {items.map((a, i) => (
          <div key={a.id} className={`rounded-lg border p-3.5 ${COLORS[i % COLORS.length]}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{typeIcon[a.fromId] ?? "📢"}</span>
                <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap bg-white rounded px-1.5 py-0.5 border">
                {new Date(a.sentAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{a.body}</p>
            <p className="text-xs text-slate-400 mt-1.5">— {a.fromName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

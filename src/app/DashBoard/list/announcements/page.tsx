"use client";

import { useState, useEffect } from "react";
import { getAllAnnouncements, addAnnouncement, deleteAnnouncement } from "@/lib/announcement-store";
import { DEPARTMENTS, YEARS, type Year } from "@/lib/university-data";
import { useAuth } from "@/context/AuthContext";
import type { Announcement } from "@/lib/university-data";

const TARGET_OPTIONS = [
  { label: "All Students & Teachers", year: undefined, dept: undefined },
  ...YEARS.map((y) => ({ label: `Year ${y} – All Departments`, year: y, dept: undefined as string | undefined })),
  ...DEPARTMENTS.map((d) => ({ label: `All Years – ${d}`, year: undefined as Year | undefined, dept: d })),
  ...YEARS.flatMap((y) =>
    DEPARTMENTS.map((d) => ({
      label: `Year ${y} – ${d}`,
      year: y as Year | undefined,
      dept: d,
    }))
  ),
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [items, setItems] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetIdx, setTargetIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const refresh = () => setItems(getAllAnnouncements());

  useEffect(() => { refresh(); }, []);

  const handleSend = () => {
    const target = TARGET_OPTIONS[targetIdx];
    addAnnouncement({
      fromId: user?.role === "ADMIN" ? "admin" : `teacher-${user?.username}`,
      fromName: user?.role === "ADMIN" ? "University Admin" : `Dr. ${user?.username}`,
      targetYear: target.year,
      targetDepartment: target.dept,
      title,
      body,
    });
    refresh();
    setSent(true);
    setTitle(""); setBody(""); setTargetIdx(0); setShowForm(false);
    setTimeout(() => setSent(false), 3000);
  };

  const handleDelete = (id: number) => {
    deleteAnnouncement(id);
    refresh();
  };

  const filtered = items.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      a.fromName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-500">{items.length} total</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          />
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? "× Cancel" : "+ New Announcement"}
          </button>
        </div>
      </div>

      {/* Success banner */}
      {sent && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          ✅ Announcement sent successfully and visible to targeted users.
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-slate-800">New Announcement</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title..."
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Target Audience</label>
              <select
                value={targetIdx}
                onChange={(e) => setTargetIdx(+e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {TARGET_OPTIONS.map((opt, i) => (
                  <option key={i} value={i}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Write your announcement here..."
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border text-slate-600 text-sm rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!title.trim() || !body.trim()}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              📢 Send Announcement
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
            No announcements found.
          </div>
        )}

        {filtered.map((a) => {
          const target =
            a.targetYear && a.targetDepartment
              ? `Year ${a.targetYear} · ${a.targetDepartment}`
              : a.targetYear
              ? `Year ${a.targetYear} · All Departments`
              : a.targetDepartment
              ? `All Years · ${a.targetDepartment}`
              : "Everyone";

          return (
            <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{a.title}</p>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {target}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {a.fromName} · {new Date(a.sentAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{a.body}</p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0"
                    title="Delete"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

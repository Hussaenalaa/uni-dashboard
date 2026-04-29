"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  students, teachers, assistants,
  getStudentExams, getStudentAssignments, getStudentAttendance,
  getStudentResults,
  events, subjects,
  getSubjectById,
  type Student,
} from "@/lib/university-data";
import { getAnnouncementsForStudent as storeGetAnnouncements } from "@/lib/announcement-store";
import { useAuth } from "@/context/AuthContext";

// ── helpers ──────────────────────────────────────────────────────────────────
function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}
function isOverdue(dateStr: string) { return new Date(dateStr) < new Date(); }

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-amber-100 text-amber-700",
  active:   "bg-green-100 text-green-700",
  graded:   "bg-slate-100 text-slate-600",
};
const EVENT_ICONS: Record<string, string> = {
  holiday: "🏖", competition: "🏆", seminar: "🎤", general: "📅",
};

const TABS = [
  { id: "overview",      label: "Overview",      emoji: "🏠" },
  { id: "exams",         label: "Exams",          emoji: "📝" },
  { id: "assignments",   label: "Assignments",    emoji: "📌" },
  { id: "results",       label: "Results",        emoji: "🏆" },
  { id: "attendance",    label: "Attendance",     emoji: "✅" },
  { id: "events",        label: "Events",         emoji: "📅" },
  { id: "messages",      label: "Messages",       emoji: "💬" },
  { id: "announcements", label: "Announcements",  emoji: "📢" },
  { id: "profile",       label: "Profile",        emoji: "👤" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function StudentDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const urlStudentId = parseInt(id, 10);
  // Students can only see their own profile
  const ownId = user?.profileId ?? urlStudentId;
  const STUDENT_ID = user?.role === "STUDENT" ? ownId : urlStudentId;

  const student = students.find(s => s.id === STUDENT_ID);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Student not found.</p>
        <button onClick={() => router.back()} className="text-blue-600 text-sm hover:underline">← Go back</button>
      </div>
    );
  }

  if (user?.role === "STUDENT" && urlStudentId !== STUDENT_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-2xl">🔒</p>
        <p className="text-slate-700 font-medium">You can only view your own dashboard.</p>
        <button onClick={() => router.push(`/DashBoard/list/students/${STUDENT_ID}`)}
          className="text-blue-600 text-sm hover:underline">Go to my dashboard</button>
      </div>
    );
  }

  const myExams = getStudentExams(student);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white px-6 py-5 flex items-center gap-5">
        <Image src={student.photo} alt={student.name} width={64} height={64}
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/20" />
        <div className="flex-1">
          <p className="text-xs text-emerald-200 uppercase tracking-widest mb-0.5">Student Dashboard</p>
          <h1 className="text-xl font-bold">{student.name}</h1>
          <p className="text-sm text-emerald-100 mt-0.5">Year {student.year} · {student.department} · {student.email}</p>
        </div>
        <div className="hidden md:flex gap-6 text-center">
          {[
            { label: "GPA",     val: student.gpa.toFixed(1) },
            { label: "Exams",   val: myExams.length },
            { label: "Enrolled", val: student.enrollDate },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-xs text-emerald-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border-b sticky top-0 z-20 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
              <span>{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 md:p-6">
        {activeTab === "overview"      && <OverviewTab student={student} />}
        {activeTab === "exams"         && <ExamsTab student={student} />}
        {activeTab === "assignments"   && <AssignmentsTab student={student} />}
        {activeTab === "results"       && <ResultsTab student={student} />}
        {activeTab === "attendance"    && <AttendanceTab student={student} />}
        {activeTab === "events"        && <EventsTab />}
        {activeTab === "messages"      && <MessagesTab student={student} />}
        {activeTab === "announcements" && <AnnouncementsTab student={student} />}
        {activeTab === "profile"       && <ProfileTab student={student} />}
      </div>
    </div>
  );
}

// ════════════════════════════════════
// OVERVIEW TAB
// ════════════════════════════════════
function OverviewTab({ student }: { student: Student }) {
  const myExams = getStudentExams(student);
  const myAssignments = getStudentAssignments(student);
  const att = getStudentAttendance(student.id);
  const attPct = att.total > 0 ? Math.round((att.present / att.total) * 100) : 0;
  const mySubjects = subjects.filter(s => s.year === student.year && s.department === student.department);
  const upcoming = myExams.filter(e => e.status === "upcoming");
  const pendingAssignments = myAssignments.filter(a => !isOverdue(a.deadline));

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "GPA",          val: student.gpa.toFixed(1), icon: "🎓", color: "bg-blue-50 border-blue-200" },
          { label: "Subjects",     val: mySubjects.length,      icon: "📚", color: "bg-purple-50 border-purple-200" },
          { label: "Upcoming Exams", val: upcoming.length,      icon: "📝", color: "bg-amber-50 border-amber-200" },
          { label: "Attendance",   val: `${attPct}%`,           icon: "✅", color: "bg-green-50 border-green-200" },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className={`rounded-xl border p-4 ${color}`}>
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-bold text-slate-800">{val}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-3">My Subjects – Year {student.year}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mySubjects.map(s => {
            const teacher = teachers.find(t => t.id === s.teacherId);
            return (
              <div key={s.id} className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition">
                <p className="font-semibold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400 mt-1">{s.code} · {s.hours}h/week</p>
                {teacher && <p className="text-xs text-emerald-600 mt-1.5">👨‍🏫 {teacher.name}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending assignments */}
      {pendingAssignments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-semibold text-amber-800 text-sm mb-2">⏰ Pending Assignments</p>
          {pendingAssignments.map(a => (
            <div key={a.id} className="flex justify-between text-sm py-1">
              <span className="text-slate-700">{a.title}</span>
              <span className="text-amber-600 font-medium">{daysUntil(a.deadline)}d left</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════
// EXAMS TAB
// ════════════════════════════════════
function ExamsTab({ student }: { student: Student }) {
  const myExams = getStudentExams(student);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-slate-700">My Exams ({myExams.length})</h2>
      {myExams.map(exam => {
        const sub = getSubjectById(exam.subjectId);
        const d = daysUntil(exam.date);
        const total = exam.questions.reduce((s, q) => s + q.points, 0);
        const mcq = exam.questions.filter(q => q.type === "mcq").length;
        const tf  = exam.questions.filter(q => q.type === "truefalse").length;
        const ess = exam.questions.filter(q => q.type === "essay").length;
        const isOpen = selected === exam.id;
        return (
          <div key={exam.id} className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="p-5 flex items-start justify-between gap-4 cursor-pointer"
              onClick={() => setSelected(isOpen ? null : exam.id)}>
              <div>
                <p className="font-semibold text-slate-800">{exam.title}</p>
                <p className="text-xs text-slate-500 mt-1">{sub?.name} · {exam.date}</p>
                <p className="text-xs text-slate-500">⏱ {exam.durationMin} min · 🏆 {total} pts</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {mcq > 0 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{mcq} MCQ</span>}
                  {tf  > 0 && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{tf} T/F</span>}
                  {ess > 0 && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{ess} Essay</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[exam.status]}`}>
                  {exam.status}
                </span>
                {exam.status === "upcoming" && d >= 0 &&
                  <span className="text-xs text-amber-600 font-medium">{d === 0 ? "Today!" : `In ${d} days`}</span>}
              </div>
            </div>

            {isOpen && (
              <div className="border-t px-5 pb-5 pt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Questions Preview</p>
                <div className="flex flex-col gap-2">
                  {exam.questions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-3 text-sm">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                        q.type==="mcq" ? "bg-blue-100 text-blue-700"
                        : q.type==="truefalse" ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700"}`}>
                        Q{idx+1}
                      </span>
                      <span className="text-slate-700">{q.text}</span>
                      <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{q.points}pt</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {myExams.length === 0 && <p className="text-center text-slate-400 py-10">No exams found.</p>}
    </div>
  );
}

// ════════════════════════════════════
// ASSIGNMENTS TAB
// ════════════════════════════════════
function AssignmentsTab({ student }: { student: Student }) {
  const myAssignments = getStudentAssignments(student);
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<Record<number, { fileName: string; time: string }>>({});

  const handleSubmit = (id: number) => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setSubmitted(prev => ({ ...prev, [id]: { fileName: file.name, time: new Date().toLocaleTimeString() } }));
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-slate-700">My Assignments ({myAssignments.length})</h2>
      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.zip" className="hidden" />
      {myAssignments.map(a => {
        const sub = getSubjectById(a.subjectId);
        const overdue = isOverdue(a.deadline);
        const dl = daysUntil(a.deadline);
        const mySubmission = a.submissions.find(s => s.studentId === student.id);
        const justSubmitted = submitted[a.id];
        const hasSubmitted = !!mySubmission || !!justSubmitted;

        let statusLabel = "Missing";
        let statusColor = "bg-red-50 text-red-600";
        if (hasSubmitted) {
          if (overdue) { statusLabel = "Late"; statusColor = "bg-amber-50 text-amber-600"; }
          else { statusLabel = "Submitted"; statusColor = "bg-green-50 text-green-700"; }
        } else if (!overdue) {
          statusLabel = "Pending"; statusColor = "bg-blue-50 text-blue-600";
        }

        return (
          <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-500 mt-1">{sub?.name}</p>
                <p className="text-sm text-slate-600 mt-2">{a.description}</p>
                {a.pdfUrl && (
                  <a href={a.pdfUrl} className="text-xs text-blue-600 mt-2 flex items-center gap-1 hover:underline">
                    📎 Download Assignment PDF
                  </a>
                )}
                <div className="flex gap-3 mt-3 items-center flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${overdue ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                    📅 {new Date(a.deadline).toLocaleDateString()} {!overdue ? `· ${dl}d left` : "· OVERDUE"}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                  {mySubmission?.grade != null && (
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                      Grade: {mySubmission.grade}/20
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submission area */}
            {!overdue && !hasSubmitted && (
              <div className="mt-4 pt-3 border-t flex items-center gap-3">
                <button onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition">
                  📎 Choose File (PDF / DOC / ZIP)
                </button>
                <button onClick={() => handleSubmit(a.id)}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
                  Submit
                </button>
              </div>
            )}
            {justSubmitted && (
              <p className="text-xs text-green-600 mt-2 pt-2 border-t">
                ✅ Submitted: {justSubmitted.fileName} at {justSubmitted.time}
              </p>
            )}
            {mySubmission && !justSubmitted && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t">
                ✅ Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}
                {!overdue && <span className="text-blue-600 ml-2 cursor-pointer hover:underline" onClick={() => fileRef.current?.click()}>Edit submission</span>}
              </p>
            )}
          </div>
        );
      })}
      {myAssignments.length === 0 && <p className="text-center text-slate-400 py-10">No assignments found.</p>}
    </div>
  );
}

// ════════════════════════════════════
// RESULTS TAB
// ════════════════════════════════════
function ResultsTab({ student }: { student: Student }) {
  const results = getStudentResults(student.id);
  const graded = results.filter(r => r.grade != null);
  const avg = graded.length > 0 ? Math.round(graded.reduce((s, r) => s + (r.grade ?? 0), 0) / graded.length) : 0;

  return (
    <div className="flex flex-col gap-4">
      {graded.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex gap-6 items-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{avg}</p>
            <p className="text-xs text-slate-500 mt-0.5">Average Score</p>
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avg}%` }} />
          </div>
          <p className="text-sm text-slate-500">{avg}/100</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {results.map(({ exam, grade }) => {
          const sub = getSubjectById(exam.subjectId);
          const total = exam.questions.reduce((s, q) => s + q.points, 0);
          const pct = grade != null ? Math.round((grade / total) * 100) : null;
          const color = pct == null ? "text-slate-400"
            : pct >= 85 ? "text-green-600"
            : pct >= 70 ? "text-blue-600"
            : "text-red-500";
          return (
            <div key={exam.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{exam.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{sub?.name} · {exam.date}</p>
                </div>
                <div className="text-right">
                  {grade != null ? (
                    <>
                      <p className={`text-2xl font-bold ${color}`}>{grade}<span className="text-sm text-slate-400">/{total}</span></p>
                      <p className={`text-xs font-medium ${color}`}>{pct}%</p>
                    </>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full ${STATUS_COLORS[exam.status]}`}>{exam.status}</span>
                  )}
                </div>
              </div>
              {grade != null && pct != null && (
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct>=85?"bg-green-500":pct>=70?"bg-blue-500":"bg-red-400"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {results.length === 0 && <p className="text-center text-slate-400 py-10">No results yet.</p>}
    </div>
  );
}

// ════════════════════════════════════
// ATTENDANCE TAB
// ════════════════════════════════════
function AttendanceTab({ student }: { student: Student }) {
  const att = getStudentAttendance(student.id);
  const pct = att.total > 0 ? Math.round((att.present / att.total) * 100) : 0;
  const mySubjects = subjects.filter(s => s.year === student.year && s.department === student.department);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Attendance Summary</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-800">{pct}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-sm text-slate-600">Present: <strong>{att.present}</strong> sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-sm text-slate-600">Absent: <strong>{att.absent}</strong> sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-slate-300 flex-shrink-0" />
              <span className="text-sm text-slate-600">Total: <strong>{att.total}</strong> sessions</span>
            </div>
            {pct < 75 && (
              <p className="text-xs text-red-600 mt-1 bg-red-50 px-3 py-1.5 rounded-lg">
                ⚠️ Attendance below 75% — at risk of losing exam eligibility.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Per-subject */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-700 mb-3">By Subject</h2>
        <div className="flex flex-col gap-3">
          {mySubjects.map((s, i) => {
            const mockPct = [92, 85, 78, 95, 70][i % 5];
            const color = mockPct >= 75 ? "bg-green-500" : "bg-red-400";
            const textColor = mockPct >= 75 ? "text-green-600" : "text-red-500";
            return (
              <div key={s.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-700">{s.name}</span>
                  <span className={`text-sm font-semibold ${textColor}`}>{mockPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${mockPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════
// EVENTS TAB
// ════════════════════════════════════
function EventsTab() {
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter(e => new Date(e.date) < now);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-slate-700">University Events</h2>
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Upcoming</p>
          <div className="flex flex-col gap-3">
            {upcoming.map(ev => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex gap-4 items-start">
                <span className="text-3xl">{EVENT_ICONS[ev.type]}</span>
                <div>
                  <p className="font-semibold text-slate-800">{ev.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">📅 {ev.date} · {daysUntil(ev.date) === 0 ? "Today!" : `In ${daysUntil(ev.date)} days`}</p>
                  <p className="text-sm text-slate-600 mt-1.5">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Past Events</p>
          <div className="flex flex-col gap-2">
            {past.map(ev => (
              <div key={ev.id} className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex gap-3 items-start opacity-60">
                <span className="text-xl">{EVENT_ICONS[ev.type]}</span>
                <div>
                  <p className="font-medium text-slate-600 text-sm">{ev.title}</p>
                  <p className="text-xs text-slate-400">{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {events.length === 0 && <p className="text-center text-slate-400 py-10">No events.</p>}
    </div>
  );
}

// ════════════════════════════════════
// MESSAGES TAB
// ════════════════════════════════════
function MessagesTab({ student }: { student: Student }) {
  const mySubjects = subjects.filter(s => s.year === student.year && s.department === student.department);
  const myTeachers = teachers.filter(t => mySubjects.some(s => s.teacherId === t.id));
  const myAssistants = assistants.filter(a => mySubjects.some(s => s.id === a.subjectId));

  type Contact = { id: string; name: string; photo: string; role: string };
  const contacts: Contact[] = [
    ...myTeachers.map(t  => ({ id: `teacher-${t.id}`,   name: t.name,  photo: t.photo,  role: "Teacher"   })),
    ...myAssistants.map(a => ({ id: `assistant-${a.id}`, name: a.name,  photo: a.photo,  role: "Assistant" })),
  ];

  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? "");
  const [text, setText] = useState("");
  const [chat, setChat] = useState<{ from: "me"|"them"; text: string; time: string }[]>([
    { from: "them", text: "Hello! How can I help you?", time: "09:00" },
  ]);

  const send = () => {
    if (!text.trim()) return;
    setChat(c => [...c, { from: "me", text, time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }]);
    setText("");
  };
  const selected = contacts.find(c => c.id === selectedId);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex h-[600px]">
      {/* Contacts */}
      <div className="w-64 border-r flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contacts</p>
        </div>
        <div className="overflow-y-auto flex-1">
          {contacts.map(c => (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 transition hover:bg-slate-50 ${selectedId===c.id?"bg-emerald-50":""}`}>
              <Image src={c.photo} alt={c.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-400">{c.role}</p>
              </div>
            </button>
          ))}
          {contacts.length === 0 && <p className="text-xs text-slate-400 p-4">No contacts</p>}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 border-b flex items-center gap-3">
          {selected && <>
            <Image src={selected.photo} alt={selected.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            <div><p className="font-semibold text-slate-800 text-sm">{selected.name}</p><p className="text-xs text-slate-400">{selected.role}</p></div>
          </>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.from==="me"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.from==="me"?"bg-emerald-600 text-white rounded-tr-sm":"bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.from==="me"?"text-emerald-200":"text-slate-400"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
            placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <button onClick={send} className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-full hover:bg-emerald-700 transition">Send</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════
// ANNOUNCEMENTS TAB
// ════════════════════════════════════
function AnnouncementsTab({ student }: { student: Student }) {
  const items = storeGetAnnouncements(student.year, student.department);
  const COLORS = ["bg-sky-50 border-sky-200","bg-purple-50 border-purple-200","bg-emerald-50 border-emerald-200","bg-amber-50 border-amber-200"];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-slate-700">Announcements ({items.length})</h2>
      {items.length === 0 && <p className="text-center text-slate-400 py-10">No announcements yet.</p>}
      {items.map((a, i) => (
        <div key={a.id} className={`rounded-xl border p-4 ${COLORS[i % COLORS.length]}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
            <span className="text-xs text-slate-400 bg-white border rounded px-1.5 py-0.5 whitespace-nowrap">{new Date(a.sentAt).toLocaleDateString()}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{a.body}</p>
          <p className="text-xs text-slate-400 mt-1.5">— {a.fromName}</p>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════
// PROFILE TAB
// ════════════════════════════════════
function ProfileTab({ student }: { student: Student }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto]     = useState(student.photo);
  const [name, setName]       = useState(student.name);
  const [phone, setPhone]     = useState(student.phone);
  const [oldPw, setOldPw]     = useState("");
  const [newPw, setNewPw]     = useState("");
  const [saved, setSaved]     = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {/* Profile Photo */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Image src={photo} alt="Profile" width={96} height={96} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100" />
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-emerald-700 transition">
            ✏️
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-800 text-lg">{student.name}</p>
          <p className="text-sm text-emerald-600">{student.email}</p>
          <p className="text-xs text-slate-400 mt-0.5">Year {student.year} · {student.department}</p>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-slate-800">Edit Profile</h2>
        {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">✅ Profile updated.</div>}
        <div>
          <label className="text-xs text-slate-500 block mb-1">Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Email (read-only)</label>
          <input value={student.email} disabled className="border rounded-lg px-3 py-2 text-sm w-full bg-slate-50 text-slate-400" />
        </div>
        <div className="flex justify-end">
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-slate-800">Change Password</h2>
        {pwSaved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">✅ Password changed.</div>}
        <div>
          <label className="text-xs text-slate-500 block mb-1">Current Password</label>
          <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">New Password</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div className="flex justify-end">
          <button disabled={!oldPw || !newPw}
            onClick={() => { setPwSaved(true); setOldPw(""); setNewPw(""); setTimeout(() => setPwSaved(false), 3000); }}
            className="px-5 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50 transition">
            Change Password
          </button>
        </div>
      </div>

      {/* Info (read-only) */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-3">Academic Info</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Student ID", val: `STU-${student.id}` },
            { label: "Department",  val: student.department },
            { label: "Year",        val: `Year ${student.year}` },
            { label: "GPA",         val: student.gpa.toFixed(2) },
            { label: "Blood Type",  val: student.bloodType },
            { label: "Enrolled",    val: student.enrollDate },
          ].map(({ label, val }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="font-semibold text-slate-800 mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
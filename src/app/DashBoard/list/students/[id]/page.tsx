"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  universityStudents,
  universityTeachers,
  universityAssistants,
  getStudentExams,
  getStudentAssignments,
  getStudentResults,
  getStudentAttendance,
  universityMessages,
  universityAnnouncements,
  universityEvents,
  assignmentSubmissions,
  lectures,
  type Message,
  type AssignmentSubmission,
  type UniEvent,
  type Announcement,
} from "@/lib/university-data";

type Tab = "exams" | "assignments" | "results" | "attendance" | "events" | "messages" | "announcements";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "exams",          label: "Exams",          icon: "/exam.png" },
  { key: "assignments",    label: "Assignments",    icon: "/assignment.png" },
  { key: "results",        label: "Results",        icon: "/result.png" },
  { key: "attendance",     label: "Attendance",     icon: "/attendance.png" },
  { key: "events",         label: "Events",         icon: "/calendar.png" },
  { key: "messages",       label: "Messages",       icon: "/message.png" },
  { key: "announcements",  label: "Announcements",  icon: "/announcement.png" },
];

// ═══════════════════════════════════════════════════════════
// EXAMS TAB (student view - read only)
// ═══════════════════════════════════════════════════════════
function StudentExamsTab({ studentId }: { studentId: number }) {
  const exams = getStudentExams(studentId);

  return (
    <div>
      {exams.length === 0 ? (
        <p className="text-gray-400 text-sm">No exams available.</p>
      ) : (
        <div className="space-y-3">
          {exams.map((e) => (
            <div key={e.id} className="bg-gray-50 border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.subject} · {e.department} Year {e.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{e.date}</p>
                  <p className="text-xs text-gray-500">{e.duration} min · {e.totalMarks} marks</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.questions.map((q, i) => (
                  <span key={q.id} className={`text-xs px-2 py-1 rounded-full ${
                    q.type === "mcq" ? "bg-blue-50 text-blue-700" :
                    q.type === "true_false" ? "bg-yellow-50 text-yellow-700" :
                    "bg-purple-50 text-purple-700"
                  }`}>
                    Q{i + 1}: {q.type === "mcq" ? "MCQ" : q.type === "true_false" ? "T/F" : "Essay"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ASSIGNMENTS TAB (student view - with upload)
// ═══════════════════════════════════════════════════════════
function StudentAssignmentsTab({ studentId }: { studentId: number }) {
  const student = universityStudents.find((s) => s.id === studentId);
  const assignments = getStudentAssignments(studentId);
  const [localSubmissions, setLocalSubmissions] = useState<AssignmentSubmission[]>(
    assignmentSubmissions.filter((s) => s.studentId === studentId)
  );
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(assignmentId: number) {
    const fileName = fileRef.current?.files?.[0]?.name || "submission.pdf";
    const sub: AssignmentSubmission = {
      id: Date.now(),
      assignmentId,
      studentId,
      studentName: student?.name || "",
      submittedAt: new Date().toISOString(),
      fileName,
    };
    setLocalSubmissions((prev) => [...prev, sub]);
    setUploadingId(null);
  }

  return (
    <div>
      {assignments.length === 0 ? (
        <p className="text-gray-400 text-sm">No assignments available.</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const submitted = localSubmissions.find((s) => s.assignmentId === a.id);
            const isPastDue = new Date(a.dueDate) < new Date();
            return (
              <div key={a.id} className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{a.subject}</p>
                    {a.hasPdf && <p className="text-xs text-blue-600 mt-1">📎 {a.pdfName}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isPastDue ? "text-red-600" : "text-green-600"}`}>
                      Due: {a.dueDate}
                    </p>
                    {submitted ? (
                      <p className="text-xs text-green-600 mt-1">Submitted: {submitted.fileName}</p>
                    ) : isPastDue ? (
                      <p className="text-xs text-red-500 mt-1">Past due</p>
                    ) : null}
                  </div>
                </div>
                {!submitted && !isPastDue && (
                  <div className="mt-3">
                    {uploadingId === a.id ? (
                      <div className="flex gap-2 items-center">
                        <input type="file" ref={fileRef} className="text-sm" />
                        <button onClick={() => handleUpload(a.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Submit</button>
                        <button onClick={() => setUploadingId(null)} className="text-gray-500 text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setUploadingId(a.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
                        Upload Assignment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RESULTS TAB
// ═══════════════════════════════════════════════════════════
function StudentResultsTab({ studentId }: { studentId: number }) {
  const results = getStudentResults(studentId);
  const exams = getStudentExams(studentId);

  return (
    <div>
      {results.length === 0 ? (
        <p className="text-gray-400 text-sm">No results available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="p-3">Exam</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Score</th>
                <th className="p-3">Total</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const exam = exams.find((e) => e.id === r.examId);
                const pct = Math.round((r.score / r.totalMarks) * 100);
                return (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{exam?.title || "Exam"}</td>
                    <td className="p-3">{exam?.subject || "-"}</td>
                    <td className="p-3">{r.score}</td>
                    <td className="p-3">{r.totalMarks}</td>
                    <td className="p-3">{pct}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pct >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {pct >= 60 ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ATTENDANCE TAB (student view)
// ═══════════════════════════════════════════════════════════
function StudentAttendanceTab({ studentId }: { studentId: number }) {
  const records = getStudentAttendance(studentId);
  const student = universityStudents.find((s) => s.id === studentId);

  const studentLectures = lectures.filter(
    (l) => student && l.department === student.department && l.year === student.year
  );

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const total = presentCount + absentCount;
  const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{pct}%</p>
          <p className="text-xs text-blue-600">Attendance Rate</p>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-400 text-sm">No attendance records.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="p-3">Subject</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const lec = lectures.find((l) => l.id === r.lectureId);
              return (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{lec?.subject || "-"}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EVENTS TAB
// ═══════════════════════════════════════════════════════════
function StudentEventsTab() {
  const events = universityEvents.filter(
    (e) => e.targetAudience === "all" || e.targetAudience === "students"
  );

  const typeColors: Record<string, string> = {
    holiday: "bg-red-100 text-red-700",
    competition: "bg-purple-100 text-purple-700",
    seminar: "bg-blue-100 text-blue-700",
    general: "bg-gray-100 text-gray-700",
  };

  return (
    <div>
      {events.length === 0 ? (
        <p className="text-gray-400 text-sm">No events.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="bg-gray-50 border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{e.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{e.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[e.type] || typeColors.general}`}>
                    {e.type}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{e.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MESSAGES TAB (student)
// ═══════════════════════════════════════════════════════════
function StudentMessagesTab({ studentId }: { studentId: number }) {
  const student = universityStudents.find((s) => s.id === studentId);
  const [messages, setMessages] = useState<Message[]>(
    universityMessages.filter(
      (m) =>
        (m.toRole === "student" && m.toId === studentId) ||
        (m.fromRole === "student" && m.fromId === studentId)
    )
  );
  const [newMsg, setNewMsg] = useState("");
  const [toRole, setToRole] = useState<"teacher" | "assistant">("teacher");
  const [toName, setToName] = useState("");

  function sendMessage() {
    if (!newMsg.trim() || !toName.trim()) return;
    const msg: Message = {
      id: Date.now(),
      fromId: studentId,
      fromName: student?.name || "",
      fromRole: "student",
      toId: 0,
      toName,
      toRole,
      content: newMsg,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg("");
    setToName("");
  }

  return (
    <div>
      <div className="bg-gray-50 border rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold mb-3">Send New Message</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          <select className="border rounded px-3 py-2 text-sm" value={toRole} onChange={(e) => setToRole(e.target.value as "teacher" | "assistant")}>
            <option value="teacher">Teacher</option>
            <option value="assistant">Assistant</option>
          </select>
          <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Recipient name" value={toName} onChange={(e) => setToName(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Type your message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
          <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Send</button>
        </div>
      </div>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages.</p>
        ) : (
          messages.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((m) => (
            <div key={m.id} className={`border rounded-lg p-3 ${m.fromRole === "student" && m.fromId === studentId ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{m.fromName} <span className="text-gray-400">→</span> {m.toName}</p>
                  <p className="text-xs text-gray-400">{m.fromRole} → {m.toRole}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm mt-1 text-gray-700">{m.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ANNOUNCEMENTS TAB (student - read only)
// ═══════════════════════════════════════════════════════════
function StudentAnnouncementsTab({ studentId }: { studentId: number }) {
  const student = universityStudents.find((s) => s.id === studentId);
  if (!student) return <p className="text-gray-400 text-sm">Student not found.</p>;

  const announcements = universityAnnouncements.filter(
    (a) =>
      a.targetDepartment === "all" ||
      (a.targetDepartment === student.department &&
        (!a.targetYear || a.targetYear === student.year))
  );

  const bgColors = ["bg-blue-50", "bg-purple-50", "bg-green-50", "bg-yellow-50", "bg-pink-50"];

  return (
    <div>
      {announcements.length === 0 ? (
        <p className="text-gray-400 text-sm">No announcements.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={a.id} className={`${bgColors[i % bgColors.length]} border rounded-lg p-4`}>
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{a.title}</h4>
                <span className="text-xs text-gray-400">{a.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2">From: {a.fromName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
const SingleStudentPage = () => {
  const params = useParams();
  const studentId = Number(params.id);
  const [activeTab, setActiveTab] = useState<Tab>("exams");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const student = universityStudents.find((s) => s.id === studentId);
  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p className="text-gray-500">Student not found.</p>
      </div>
    );
  }

  const displayPhoto = photoUrl || student.photo;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  }

  const results = getStudentResults(studentId);
  const attendance = getStudentAttendance(studentId);
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const totalAtt = attendance.length;
  const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Student profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800 tracking-tight">Student Overview</h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="flex flex-col gap-6">
          {/* Profile card */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-sky-400 to-indigo-500" />
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4 relative">
                <Image src={displayPhoto} alt={student.name} width={80} height={80} className="w-20 h-20 rounded-xl object-cover ring-4 ring-white shadow" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-blue-700"
                  title="Change photo"
                >
                  📷
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
              <p className="text-sm text-sky-600 font-medium mt-0.5">{student.department} · Year {student.year}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                  </span>
                  {student.email}
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                  </span>
                  {student.phone}
                </li>
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{student.studentId}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Student ID</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{attPct}%</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Attendance</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{results.length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Exam Results</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{getStudentAssignments(studentId).length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Assignments</p>
            </div>
          </div>
        </aside>

        {/* ════ RIGHT MAIN AREA ════ */}
        <main className="flex flex-col gap-6">
          {/* Tabs */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex flex-wrap border-b">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Image src={tab.icon} alt="" width={16} height={16} className="opacity-60" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "exams" && <StudentExamsTab studentId={studentId} />}
              {activeTab === "assignments" && <StudentAssignmentsTab studentId={studentId} />}
              {activeTab === "results" && <StudentResultsTab studentId={studentId} />}
              {activeTab === "attendance" && <StudentAttendanceTab studentId={studentId} />}
              {activeTab === "events" && <StudentEventsTab />}
              {activeTab === "messages" && <StudentMessagesTab studentId={studentId} />}
              {activeTab === "announcements" && <StudentAnnouncementsTab studentId={studentId} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleStudentPage;

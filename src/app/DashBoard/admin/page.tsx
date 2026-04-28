"use client";

import { useState } from "react";
import Image from "next/image";
import {
  universityStudents,
  universityTeachers,
  universityAssistants,
  lectures,
  universityExams,
  universityEvents,
  universityMessages,
  universityAnnouncements,
  examResults,
  attendanceRecords,
  type UniversityStudent,
  type UniversityTeacher,
  type Assistant,
  type Lecture,
  type UniEvent,
  type Message,
  type Announcement,
  type Department,
  type Year,
} from "@/lib/university-data";
import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import FinanceChart from "@/components/FinanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

type AdminTab = "overview" | "users" | "schedule" | "exams" | "attendance" | "events" | "messages" | "announcements";

const ADMIN_TABS: { key: AdminTab; label: string }[] = [
  { key: "overview",       label: "Overview" },
  { key: "users",          label: "Users" },
  { key: "schedule",       label: "Schedule" },
  { key: "exams",          label: "Exams & Results" },
  { key: "attendance",     label: "Attendance" },
  { key: "events",         label: "Events" },
  { key: "messages",       label: "Messages" },
  { key: "announcements",  label: "Announcements" },
];

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB (original dashboard)
// ═══════════════════════════════════════════════════════════
function OverviewTab() {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Student" />
          <UserCard type="Teacher" />
          <UserCard type="Tech Assistance" />
          <UserCard type="Staff" />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]"><CountChart /></div>
          <div className="w-full lg:w-2/3 h-[450px]"><AttendanceChart /></div>
        </div>
        <div className="w-full h-[500px]"><FinanceChart /></div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8"><EventCalendar /><Announcements /></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════
function UsersTab() {
  const [userType, setUserType] = useState<"students" | "teachers" | "assistants">("students");
  const [localStudents, setLocalStudents] = useState([...universityStudents]);
  const [localTeachers, setLocalTeachers] = useState([...universityTeachers]);
  const [localAssistants, setLocalAssistants] = useState([...universityAssistants]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState<Department>("IT");
  const [formYear, setFormYear] = useState<Year>(1);
  const [formSubjects, setFormSubjects] = useState("");

  function addUser() {
    if (!formName.trim() || !formEmail.trim()) return;
    if (userType === "students") {
      const s: UniversityStudent = {
        id: Date.now(),
        name: formName,
        email: formEmail,
        phone: formPhone,
        photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
        department: formDept,
        year: formYear,
        studentId: `${formDept}-${formYear}-${(localStudents.length + 1).toString().padStart(3, "0")}`,
      };
      setLocalStudents((prev) => [...prev, s]);
    } else if (userType === "teachers") {
      const t: UniversityTeacher = {
        id: Date.now(),
        name: formName,
        email: formEmail,
        phone: formPhone,
        photo: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
        subjects: formSubjects.split(",").map((s) => ({ name: s.trim(), department: formDept, year: formYear })),
      };
      setLocalTeachers((prev) => [...prev, t]);
    } else {
      const a: Assistant = {
        id: Date.now(),
        name: formName,
        email: formEmail,
        phone: formPhone,
        photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
        department: formDept,
        year: formYear,
        subjects: formSubjects.split(",").map((s) => s.trim()),
      };
      setLocalAssistants((prev) => [...prev, a]);
    }
    setShowAddForm(false);
    setFormName(""); setFormEmail(""); setFormPhone(""); setFormSubjects("");
  }

  function deleteStudent(id: number) { setLocalStudents((prev) => prev.filter((s) => s.id !== id)); }
  function deleteTeacher(id: number) { setLocalTeachers((prev) => prev.filter((t) => t.id !== id)); }
  function deleteAssistant(id: number) { setLocalAssistants((prev) => prev.filter((a) => a.id !== id)); }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["students", "teachers", "assistants"] as const).map((t) => (
          <button key={t} onClick={() => { setUserType(t); setShowAddForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${userType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {t}
          </button>
        ))}
        <button onClick={() => setShowAddForm(true)} className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
          + Add {userType.slice(0, -1)}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-4 max-w-lg">
          <h4 className="text-sm font-semibold mb-3 capitalize">Add New {userType.slice(0, -1)}</h4>
          <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            <div className="flex gap-2">
              <select className="border rounded px-3 py-2 text-sm" value={formDept} onChange={(e) => setFormDept(e.target.value as Department)}>
                <option value="IT">IT</option><option value="CS">CS</option>
              </select>
              <select className="border rounded px-3 py-2 text-sm" value={formYear} onChange={(e) => setFormYear(Number(e.target.value) as Year)}>
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            {(userType === "teachers" || userType === "assistants") && (
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Subjects (comma-separated)" value={formSubjects} onChange={(e) => setFormSubjects(e.target.value)} />
            )}
            <div className="flex gap-2">
              <button onClick={addUser} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Add</button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {userType === "students" && (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-3">Student</th><th className="p-3">ID</th><th className="p-3">Dept</th><th className="p-3">Year</th><th className="p-3">Email</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {localStudents.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <Image src={s.photo} alt={s.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                    {s.name}
                  </td>
                  <td className="p-3">{s.studentId}</td>
                  <td className="p-3">{s.department}</td>
                  <td className="p-3">{s.year}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">
                    <button onClick={() => deleteStudent(s.id)} className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {userType === "teachers" && (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-3">Teacher</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Subjects</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {localTeachers.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <Image src={t.photo} alt={t.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                    {t.name}
                  </td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.subjects.map((s) => s.name).join(", ")}</td>
                  <td className="p-3">
                    <button onClick={() => deleteTeacher(t.id)} className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {userType === "assistants" && (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-3">Assistant</th><th className="p-3">Dept</th><th className="p-3">Year</th><th className="p-3">Subjects</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {localAssistants.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <Image src={a.photo} alt={a.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                    {a.name}
                  </td>
                  <td className="p-3">{a.department}</td>
                  <td className="p-3">{a.year}</td>
                  <td className="p-3">{a.subjects.join(", ")}</td>
                  <td className="p-3">
                    <button onClick={() => deleteAssistant(a.id)} className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCHEDULE TAB
// ═══════════════════════════════════════════════════════════
function ScheduleTab() {
  const [localLectures, setLocalLectures] = useState<Lecture[]>([...lectures]);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ day: "", startTime: "", endTime: "", hall: "" });

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  let filtered = localLectures;
  if (filterYear !== "all") filtered = filtered.filter((l) => l.year === Number(filterYear));
  if (filterDept !== "all") filtered = filtered.filter((l) => l.department === filterDept);

  function startEdit(l: Lecture) {
    setEditingId(l.id);
    setEditForm({ day: l.day, startTime: l.startTime, endTime: l.endTime, hall: l.hall });
  }

  function saveEdit(id: number) {
    setLocalLectures((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, day: editForm.day as Lecture["day"], startTime: editForm.startTime, endTime: editForm.endTime, hall: editForm.hall }
          : l
      )
    );
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="IT">IT</option>
          <option value="CS">CS</option>
        </select>
      </div>

      <div className="space-y-3">
        {days.map((day) => {
          const dayLectures = filtered.filter((l) => l.day === day);
          if (dayLectures.length === 0) return null;
          return (
            <div key={day}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{day}</h4>
              <div className="space-y-2">
                {dayLectures.map((l) => {
                  const teacher = universityTeachers.find((t) => t.id === l.teacherId);
                  return (
                    <div key={l.id} className="bg-gray-50 border rounded-lg p-3">
                      {editingId === l.id ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{l.subject} - {teacher?.name}</p>
                          <div className="flex flex-wrap gap-2">
                            <select value={editForm.day} onChange={(e) => setEditForm({ ...editForm, day: e.target.value })} className="border rounded px-2 py-1 text-sm">
                              {days.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} className="border rounded px-2 py-1 text-sm" />
                            <input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} className="border rounded px-2 py-1 text-sm" />
                            <input value={editForm.hall} onChange={(e) => setEditForm({ ...editForm, hall: e.target.value })} className="border rounded px-2 py-1 text-sm" placeholder="Hall" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(l.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{l.subject}</p>
                            <p className="text-xs text-gray-500">{teacher?.name} · {l.startTime}-{l.endTime} · {l.hall} · {l.department} Y{l.year}</p>
                          </div>
                          <button onClick={() => startEdit(l)} className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Edit</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXAMS & RESULTS TAB
// ═══════════════════════════════════════════════════════════
function AdminExamsTab() {
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  const exam = selectedExam !== null ? universityExams.find((e) => e.id === selectedExam) : null;
  const results = exam ? examResults.filter((r) => r.examId === exam.id) : [];

  return (
    <div>
      {exam ? (
        <div>
          <button onClick={() => setSelectedExam(null)} className="text-sm text-blue-600 mb-4 hover:underline">&larr; Back to exams</button>
          <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{exam.subject} · {exam.department} Year {exam.year} · {exam.date}</p>

          <h4 className="text-sm font-semibold mt-4 mb-2">Questions</h4>
          <div className="space-y-2 mb-6">
            {exam.questions.map((q, i) => (
              <div key={q.id} className="bg-gray-50 border rounded p-3">
                <p className="text-sm"><span className="font-medium">Q{i + 1}</span> ({q.type}): {q.text}</p>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold mb-2">Student Results</h4>
          {results.length === 0 ? (
            <p className="text-gray-400 text-sm">No results.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-2">Student</th><th className="p-2">Score</th><th className="p-2">Total</th><th className="p-2">%</th></tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">{r.studentName}</td>
                    <td className="p-2">{r.score}</td>
                    <td className="p-2">{r.totalMarks}</td>
                    <td className="p-2">{Math.round((r.score / r.totalMarks) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {universityExams.map((e) => {
            const teacher = universityTeachers.find((t) => t.id === e.teacherId);
            return (
              <div key={e.id} className="bg-gray-50 border rounded-lg p-4 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedExam(e.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.subject} · {e.department} Y{e.year} · By {teacher?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{e.date}</p>
                    <p className="text-xs text-gray-500">{e.totalMarks} marks</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ATTENDANCE TAB
// ═══════════════════════════════════════════════════════════
function AdminAttendanceTab() {
  const [filterDept, setFilterDept] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  let filtered = attendanceRecords;
  const filteredWithDetails = filtered.map((r) => {
    const lecture = lectures.find((l) => l.id === r.lectureId);
    const student = universityStudents.find((s) => s.id === r.studentId);
    return { ...r, lecture, student };
  }).filter((r) => {
    if (filterDept !== "all" && r.lecture?.department !== filterDept) return false;
    if (filterYear !== "all" && r.lecture?.year !== Number(filterYear)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="IT">IT</option><option value="CS">CS</option>
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
      </div>

      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-2">Student</th><th className="p-2">Subject</th><th className="p-2">Dept</th><th className="p-2">Year</th><th className="p-2">Date</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {filteredWithDetails.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.student?.name || "-"}</td>
              <td className="p-2">{r.lecture?.subject || "-"}</td>
              <td className="p-2">{r.lecture?.department || "-"}</td>
              <td className="p-2">{r.lecture?.year || "-"}</td>
              <td className="p-2">{r.date}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EVENTS TAB
// ═══════════════════════════════════════════════════════════
function AdminEventsTab() {
  const [localEvents, setLocalEvents] = useState<UniEvent[]>([...universityEvents]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<UniEvent["type"]>("general");
  const [audience, setAudience] = useState<UniEvent["targetAudience"]>("all");

  function createEvent() {
    if (!title.trim()) return;
    setLocalEvents((prev) => [...prev, {
      id: Date.now(), title, description, date,
      type, targetAudience: audience,
    }]);
    setShowCreate(false);
    setTitle(""); setDescription(""); setDate("");
  }

  const typeColors: Record<string, string> = {
    holiday: "bg-red-100 text-red-700",
    competition: "bg-purple-100 text-purple-700",
    seminar: "bg-blue-100 text-blue-700",
    general: "bg-gray-100 text-gray-700",
  };

  return (
    <div>
      {showCreate ? (
        <div className="space-y-3 max-w-lg mb-6">
          <h4 className="text-sm font-semibold">Create New Event</h4>
          <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full border rounded px-3 py-2 text-sm" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as UniEvent["type"])}>
              <option value="general">General</option>
              <option value="holiday">Holiday</option>
              <option value="competition">Competition</option>
              <option value="seminar">Seminar</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm" value={audience} onChange={(e) => setAudience(e.target.value as UniEvent["targetAudience"])}>
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={createEvent} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mb-4">+ Add Event</button>
      )}

      <div className="space-y-3">
        {localEvents.map((e) => (
          <div key={e.id} className="bg-gray-50 border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{e.title}</p>
                <p className="text-sm text-gray-600 mt-1">{e.description}</p>
                <p className="text-xs text-gray-400 mt-1">Audience: {e.targetAudience}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[e.type]}`}>{e.type}</span>
                <p className="text-xs text-gray-500 mt-1">{e.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MESSAGES TAB
// ═══════════════════════════════════════════════════════════
function AdminMessagesTab() {
  const [messages, setMessages] = useState<Message[]>([...universityMessages]);
  const [newMsg, setNewMsg] = useState("");
  const [toRole, setToRole] = useState<"teacher" | "student">("teacher");
  const [toName, setToName] = useState("");

  function sendMessage() {
    if (!newMsg.trim() || !toName.trim()) return;
    const msg: Message = {
      id: Date.now(),
      fromId: 0, fromName: "Admin", fromRole: "admin",
      toId: 0, toName, toRole,
      content: newMsg,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg(""); setToName("");
  }

  return (
    <div>
      <div className="bg-gray-50 border rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold mb-3">Send New Message</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          <select className="border rounded px-3 py-2 text-sm" value={toRole} onChange={(e) => setToRole(e.target.value as "teacher" | "student")}>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Recipient name" value={toName} onChange={(e) => setToName(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
          <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Send</button>
        </div>
      </div>

      <div className="space-y-2">
        {messages.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((m) => (
          <div key={m.id} className={`border rounded-lg p-3 ${m.fromRole === "admin" ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{m.fromName} → {m.toName}</p>
                <p className="text-xs text-gray-400">{m.fromRole} → {m.toRole}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-sm mt-1 text-gray-700">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ANNOUNCEMENTS TAB
// ═══════════════════════════════════════════════════════════
function AdminAnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([...universityAnnouncements]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetDept, setTargetDept] = useState<Department | "all">("all");
  const [targetYear, setTargetYear] = useState<Year | undefined>(undefined);

  function createAnnouncement() {
    if (!title.trim() || !content.trim()) return;
    setAnnouncements((prev) => [...prev, {
      id: Date.now(), title, content,
      fromId: 0, fromName: "Admin", fromRole: "admin" as const,
      targetDepartment: targetDept, targetYear,
      date: new Date().toISOString().split("T")[0],
    }]);
    setShowCreate(false);
    setTitle(""); setContent("");
  }

  return (
    <div>
      {showCreate ? (
        <div className="space-y-3 max-w-lg mb-6">
          <h4 className="text-sm font-semibold">Send Announcement</h4>
          <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full border rounded px-3 py-2 text-sm" placeholder="Content..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2 text-sm" value={targetDept} onChange={(e) => setTargetDept(e.target.value as Department | "all")}>
              <option value="all">All</option>
              <option value="IT">IT</option>
              <option value="CS">CS</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm" value={targetYear ?? ""} onChange={(e) => setTargetYear(e.target.value ? Number(e.target.value) as Year : undefined)}>
              <option value="">All Years</option>
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={createAnnouncement} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Send</button>
            <button onClick={() => setShowCreate(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mb-4">+ Send Announcement</button>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-gray-50 border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">{a.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">From: {a.fromName} · To: {a.targetDepartment === "all" ? "All" : a.targetDepartment}{a.targetYear ? ` Y${a.targetYear}` : ""}</p>
              </div>
              <span className="text-xs text-gray-400">{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <div className="p-4">
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-white rounded-lg border p-1">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg border p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "exams" && <AdminExamsTab />}
        {activeTab === "attendance" && <AdminAttendanceTab />}
        {activeTab === "events" && <AdminEventsTab />}
        {activeTab === "messages" && <AdminMessagesTab />}
        {activeTab === "announcements" && <AdminAnnouncementsTab />}
      </div>
    </div>
  );
};

export default AdminPage;

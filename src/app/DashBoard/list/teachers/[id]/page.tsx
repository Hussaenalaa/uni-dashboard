"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  teachers, subjects, students, assistants as allAssistants,
  lectures as allLectures, exams as allExams, assignments as allAssignments,
  messages as allMessages, announcements as allAnnouncements, events,
  getTeacherSubjects, getSubjectStudents, getTeacherLectures,
  getTeacherAssistants, getTeacherExams, getTeacherAssignments,
  getSubjectById,
  type Lecture, type LectureMode, type Question, type QuestionType,
  type WeekDay,
} from "@/lib/university-data";
import { useAuth } from "@/context/AuthContext";

const DAYS: WeekDay[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const TABS = [
  { id: "overview",      label: "Overview",      emoji: "🏠" },
  { id: "students",      label: "Students",      emoji: "🎓" },
  { id: "classes",       label: "Classes",        emoji: "📅" },
  { id: "assistants",   label: "Assistants",     emoji: "👥" },
  { id: "exams",         label: "Exams",          emoji: "📝" },
  { id: "assignments",   label: "Assignments",    emoji: "📌" },
  { id: "attendance",    label: "Attendance",     emoji: "✅" },
  { id: "messages",      label: "Messages",       emoji: "💬" },
  { id: "announcements", label: "Announcements",  emoji: "📢" },
];

export default function TeacherDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  // Resolve which teacher ID to show
  const urlTeacherId = parseInt(id, 10);

  // TEACHER role: can only view their own profile
  // Use profileId stored in auth context (set at login)
  const ownTeacherId = user?.profileId ?? urlTeacherId;
  const TEACHER_ID = user?.role === "TEACHER" ? ownTeacherId : urlTeacherId;

  const teacher = teachers.find(t => t.id === TEACHER_ID);

  // If teacher not found or TEACHER role trying to access wrong profile
  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Teacher not found.</p>
        <button onClick={() => router.back()} className="text-blue-600 text-sm hover:underline">← Go back</button>
      </div>
    );
  }

  if (user?.role === "TEACHER" && urlTeacherId !== TEACHER_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-2xl">🔒</p>
        <p className="text-slate-700 font-medium">You can only view your own dashboard.</p>
        <button onClick={() => router.push(`/DashBoard/list/teachers/${TEACHER_ID}`)} className="text-blue-600 text-sm hover:underline">
          Go to my dashboard
        </button>
      </div>
    );
  }

  const teacherSubjects = getTeacherSubjects(TEACHER_ID);
  const teacherLectures = getTeacherLectures(TEACHER_ID);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Top Profile Header ── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-5 flex items-center gap-5">
        <Image src={teacher.photo} alt={teacher.name} width={64} height={64}
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/20" />
        <div className="flex-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Teacher Dashboard</p>
          <h1 className="text-xl font-bold">{teacher.name}</h1>
          <p className="text-sm text-slate-300 mt-0.5">{teacher.department} · {teacher.email}</p>
        </div>
        <div className="hidden md:flex gap-6 text-center">
          {[
            { label: "Subjects", val: teacherSubjects.length },
            { label: "Lectures/Week", val: teacherLectures.length },
            { label: "Students", val: new Set(teacherSubjects.flatMap(s => getSubjectStudents(s.id).map(st => st.id))).size },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b sticky top-0 z-20 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}>
              <span>{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="p-4 md:p-6">
        {activeTab === "overview"      && <OverviewTab teacher={teacher} />}
        {activeTab === "students"      && <StudentsTab teacherId={TEACHER_ID} />}
        {activeTab === "classes"       && <ClassesTab teacherId={TEACHER_ID} />}
        {activeTab === "assistants"    && <AssistantsTab teacherId={TEACHER_ID} />}
        {activeTab === "exams"         && <ExamsTab teacherId={TEACHER_ID} />}
        {activeTab === "assignments"   && <AssignmentsTab teacherId={TEACHER_ID} />}
        {activeTab === "attendance"    && <AttendanceTab teacherId={TEACHER_ID} />}
        {activeTab === "messages"      && <MessagesTab teacherId={TEACHER_ID} />}
        {activeTab === "announcements" && <AnnouncementsTab teacherId={TEACHER_ID} />}
      </div>
    </div>
  );
}

// ════════════════════════════════════
// OVERVIEW TAB
// ════════════════════════════════════
function OverviewTab({ teacher }: { teacher: typeof teachers[0] }) {
  const subs = getTeacherSubjects(teacher.id);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 col-span-full">
        <h2 className="font-semibold text-slate-700 mb-4">My Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subs.map(s => (
            <div key={s.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition">
              <p className="font-semibold text-slate-800">{s.name}</p>
              <p className="text-xs text-slate-500 mt-1">{s.code} · Year {s.year} · {s.department}</p>
              <p className="text-xs text-blue-600 mt-1">{getSubjectStudents(s.id).length} students</p>
            </div>
          ))}
        </div>
      </div>
      {[
        { label: "Phone", val: teacher.phone, icon: "📞" },
        { label: "Joined", val: teacher.joinDate, icon: "📅" },
        { label: "Blood Type", val: teacher.bloodType, icon: "🩸" },
      ].map(({ label, val, icon }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <div><p className="text-xs text-slate-400">{label}</p><p className="font-semibold text-slate-800">{val}</p></div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════
// STUDENTS TAB
// ════════════════════════════════════
function StudentsTab({ teacherId }: { teacherId: number }) {
  const subs = getTeacherSubjects(teacherId);
  const [selectedSubId, setSelectedSubId] = useState(subs[0]?.id ?? 0);
  const selectedSub = subs.find(s => s.id === selectedSubId);
  const studentList = selectedSub ? getSubjectStudents(selectedSubId) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {subs.map(s => (
          <button key={s.id} onClick={() => setSelectedSubId(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selectedSubId === s.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
            {s.name} · Yr {s.year}
          </button>
        ))}
      </div>

      {selectedSub && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">{selectedSub.name}</h2>
              <p className="text-xs text-slate-500">Year {selectedSub.year} · {selectedSub.department} · {studentList.length} students</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{selectedSub.code}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3">GPA</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Phone</th>
              </tr></thead>
              <tbody>
                {studentList.map((st, i) => (
                  <tr key={st.id} className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-blue-50/30 transition`}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Image src={st.photo} alt={st.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-slate-800">{st.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{st.email}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${st.gpa >= 3.5 ? "text-green-600" : st.gpa >= 3.0 ? "text-blue-600" : "text-amber-600"}`}>{st.gpa.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{st.phone}</td>
                  </tr>
                ))}
                {studentList.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No students found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════
// CLASSES TAB
// ════════════════════════════════════
function ClassesTab({ teacherId }: { teacherId: number }) {
  const [lectures, setLectures] = useState(getTeacherLectures(teacherId));
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Lecture>>({});

  const startEdit = (lec: Lecture) => { setEditing(lec.id); setForm({ ...lec }); };
  const cancelEdit = () => { setEditing(null); setForm({}); };
  const saveEdit = () => {
    setLectures(lecs => lecs.map(l => l.id === editing ? { ...l, ...form } as Lecture : l));
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3">
        {DAYS.map(day => {
          const dayLectures = lectures.filter(l => l.day === day);
          if (dayLectures.length === 0) return null;
          return (
            <div key={day} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-700 text-white px-5 py-2.5 text-sm font-semibold">{day}</div>
              <div className="divide-y">
                {dayLectures.map(lec => {
                  const sub = getSubjectById(lec.subjectId);
                  const isEditing = editing === lec.id;
                  return (
                    <div key={lec.id} className="px-5 py-4">
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Start Time</label>
                            <input type="time" value={form.startTime ?? lec.startTime}
                              onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                              className="border rounded-lg px-3 py-2 text-sm w-full" />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Duration (min)</label>
                            <input type="number" value={form.durationMin ?? lec.durationMin}
                              onChange={e => setForm(f => ({ ...f, durationMin: +e.target.value }))}
                              className="border rounded-lg px-3 py-2 text-sm w-full" />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Room / Link</label>
                            <input value={form.room ?? lec.room}
                              onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                              className="border rounded-lg px-3 py-2 text-sm w-full" />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">Mode</label>
                            <select value={form.mode ?? lec.mode}
                              onChange={e => setForm(f => ({ ...f, mode: e.target.value as LectureMode }))}
                              className="border rounded-lg px-3 py-2 text-sm w-full">
                              <option value="offline">Offline (On-campus)</option>
                              <option value="online">Online</option>
                            </select>
                          </div>
                          <div className="col-span-full flex gap-2">
                            <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Save Changes</button>
                            <button onClick={cancelEdit} className="px-4 py-2 border text-slate-600 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <p className="font-bold text-blue-700">{lec.startTime}</p>
                              <p className="text-xs text-slate-400">{lec.durationMin}min</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{sub?.name}</p>
                              <p className="text-xs text-slate-500">Year {sub?.year} · {sub?.department}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{lec.room}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lec.mode === "online" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                              {lec.mode === "online" ? "🌐 Online" : "🏛 On-campus"}
                            </span>
                            <button onClick={() => startEdit(lec)}
                              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition">
                              Reschedule
                            </button>
                          </div>
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

// ════════════════════════════════════
// ASSISTANTS TAB
// ════════════════════════════════════
function AssistantsTab({ teacherId }: { teacherId: number }) {
  const myAssistants = getTeacherAssistants(teacherId);
  const subs = getTeacherSubjects(teacherId);
  const [filterSubId, setFilterSubId] = useState<number | "all">("all");

  const filtered = filterSubId === "all" ? myAssistants : myAssistants.filter(a => a.subjectId === filterSubId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterSubId("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filterSubId === "all" ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300"}`}>
          All Subjects
        </button>
        {subs.map(s => (
          <button key={s.id} onClick={() => setFilterSubId(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filterSubId === s.id ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"}`}>
            {s.name} · Yr {s.year}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => {
          const sub = subs.find(s => s.id === a.subjectId);
          return (
            <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-start gap-4 hover:border-blue-200 transition">
              <Image src={a.photo} alt={a.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{a.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.email}</p>
                <p className="text-xs text-slate-500">{a.phone}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{sub?.name}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Year {a.year}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a.department}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="col-span-full text-center text-slate-400 py-8">No assistants found</p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════
// EXAMS TAB
// ════════════════════════════════════
function ExamsTab({ teacherId }: { teacherId: number }) {
  const existing = getTeacherExams(teacherId);
  const subs = getTeacherSubjects(teacherId);
  const [showForm, setShowForm] = useState(false);
  const [subjectId, setSubjectId] = useState(subs[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(90);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saved, setSaved] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const base = { id: Date.now(), type, text: "", points: type === "essay" ? 5 : type === "mcq" ? 2 : 1 };
    const q: Question = type === "mcq"
      ? { ...base, options: ["", "", "", ""], answer: "" }
      : type === "truefalse"
      ? { ...base, answer: "True" }
      : base;
    setQuestions(qs => [...qs, q]);
  };
  const updateQuestion = (id: number, patch: Partial<Question>) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q));
  const removeQuestion = (id: number) => setQuestions(qs => qs.filter(q => q.id !== id));

  const handleSave = () => {
    setSaved(true);
    setShowForm(false);
    setTitle(""); setDate(""); setDuration(90); setQuestions([]);
    setTimeout(() => setSaved(false), 3000);
  };

  const statusColors = { upcoming: "bg-amber-100 text-amber-700", active: "bg-green-100 text-green-700", graded: "bg-slate-100 text-slate-600" };

  return (
    <div className="flex flex-col gap-4">
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">✅ Exam created and sent to students.</div>}

      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-slate-700">Exams ({existing.length})</h2>
        <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          {showForm ? "× Cancel" : "+ Create Exam"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-800">New Exam</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Exam Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Midterm Exam"
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Subject & Year</label>
              <select value={subjectId} onChange={e => setSubjectId(+e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                {subs.map(s => <option key={s.id} value={s.id}>{s.name} · Yr {s.year}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Duration (min)</label>
              <input type="number" value={duration} onChange={e => setDuration(+e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-slate-700 text-sm">Questions ({questions.length})</p>
              <div className="flex gap-2">
                {([["mcq","MCQ"],["truefalse","True/False"],["essay","Essay"]] as [QuestionType,string][]).map(([t,l]) => (
                  <button key={t} onClick={() => addQuestion(t)}
                    className="px-3 py-1 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
                    + {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      q.type === "mcq" ? "bg-blue-100 text-blue-700"
                      : q.type === "truefalse" ? "bg-purple-100 text-purple-700"
                      : "bg-amber-100 text-amber-700"}`}>
                      Q{idx + 1} · {q.type === "mcq" ? "MCQ" : q.type === "truefalse" ? "True/False" : "Essay"}
                    </span>
                    <div className="flex items-center gap-2">
                      <input type="number" value={q.points} onChange={e => updateQuestion(q.id, { points: +e.target.value })}
                        className="border rounded px-2 py-1 text-xs w-16 text-center" placeholder="pts" />
                      <span className="text-xs text-slate-400">pts</span>
                      <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                    </div>
                  </div>
                  <input value={q.text} onChange={e => updateQuestion(q.id, { text: e.target.value })}
                    placeholder="Question text..." className="border rounded-lg px-3 py-2 text-sm w-full mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  {q.type === "mcq" && (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map((opt, oi) => (
                        <div key={oi} className="flex gap-1 items-center">
                          <span className="text-xs text-slate-400 w-5">{String.fromCharCode(65+oi)}.</span>
                          <input value={opt}
                            onChange={e => { const opts = [...(q.options??[])]; opts[oi]=e.target.value; updateQuestion(q.id,{options:opts}); }}
                            placeholder={`Option ${String.fromCharCode(65+oi)}`}
                            className="border rounded px-2 py-1 text-sm flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300" />
                        </div>
                      ))}
                      <div className="col-span-2">
                        <label className="text-xs text-slate-500 mr-2">Correct Answer:</label>
                        <select value={q.answer ?? ""} onChange={e => updateQuestion(q.id, { answer: e.target.value })}
                          className="border rounded px-2 py-1 text-xs bg-white">
                          {q.options?.map((_, oi) => <option key={oi} value={String.fromCharCode(65+oi)}>{String.fromCharCode(65+oi)}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  {q.type === "truefalse" && (
                    <div className="flex gap-3">
                      {["True","False"].map(v => (
                        <label key={v} className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="radio" name={`tf-${q.id}`} value={v} checked={q.answer===v}
                            onChange={() => updateQuestion(q.id, { answer: v })} /> {v}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">Add questions using the buttons above</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border text-slate-600 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={!title || !date || questions.length === 0}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              Send to Students
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {existing.map(exam => {
          const sub = getSubjectById(exam.subjectId);
          const mcq = exam.questions.filter(q => q.type === "mcq").length;
          const tf  = exam.questions.filter(q => q.type === "truefalse").length;
          const ess = exam.questions.filter(q => q.type === "essay").length;
          const total = exam.questions.reduce((s, q) => s + q.points, 0);
          return (
            <div key={exam.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{exam.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub?.name} · Year {exam.year} · {exam.department}</p>
                  <p className="text-xs text-slate-500">📅 {exam.date} · ⏱ {exam.durationMin} min · 🏆 {total} pts</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {mcq > 0 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{mcq} MCQ</span>}
                    {tf  > 0 && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{tf} True/False</span>}
                    {ess > 0 && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{ess} Essay</span>}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[exam.status]}`}>{exam.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════
// ASSIGNMENTS TAB
// ════════════════════════════════════
function AssignmentsTab({ teacherId }: { teacherId: number }) {
  const existing = getTeacherAssignments(teacherId);
  const subs = getTeacherSubjects(teacherId);
  const [showForm, setShowForm] = useState(false);
  const [subjectId, setSubjectId] = useState(subs[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true); setShowForm(false);
    setTitle(""); setDescription(""); setDeadline(""); setPdfName("");
    setTimeout(() => setSaved(false), 3000);
  };

  const isOverdue = (d: string) => new Date(d) < new Date();
  const daysLeft = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    return diff > 0 ? `${diff}d left` : "Overdue";
  };

  return (
    <div className="flex flex-col gap-4">
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">✅ Assignment posted to students.</div>}

      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-slate-700">Assignments ({existing.length})</h2>
        <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition">
          {showForm ? "× Cancel" : "+ New Assignment"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-slate-800">New Assignment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title"
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Subject & Year</label>
              <select value={subjectId} onChange={e => setSubjectId(+e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400">
                {subs.map(s => <option key={s.id} value={s.id}>{s.name} · Yr {s.year}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Deadline</label>
              <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                placeholder="Describe the assignment..."
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">Attach PDF (optional)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
                  📎 Choose File
                </button>
                {pdfName && <span className="text-xs text-green-600">✓ {pdfName}</span>}
                <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                  onChange={e => setPdfName(e.target.files?.[0]?.name ?? "")} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border text-slate-600 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} disabled={!title || !deadline || !description}
              className="px-5 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 disabled:opacity-50 transition">
              Post Assignment
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {existing.map(a => {
          const sub = getSubjectById(a.subjectId);
          const overdue = isOverdue(a.deadline);
          const submitted = a.submissions.length;
          const total = getSubjectStudents(a.subjectId).length;
          return (
            <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub?.name} · Year {a.year} · {a.department}</p>
                  <p className="text-sm text-slate-600 mt-2">{a.description}</p>
                  <div className="flex gap-3 mt-3 items-center flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${overdue ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                      📅 {new Date(a.deadline).toLocaleDateString()} · {daysLeft(a.deadline)}
                    </span>
                    {a.pdfUrl && <span className="text-xs text-blue-600">📎 PDF attached</span>}
                    <span className="text-xs text-slate-500">{submitted}/{total} submitted</span>
                  </div>
                </div>
              </div>
              {a.submissions.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Submissions</p>
                  <div className="flex flex-col gap-1">
                    {a.submissions.map(s => {
                      const st = students.find(st => st.id === s.studentId);
                      return (
                        <div key={s.studentId} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700">{st?.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">{new Date(s.submittedAt).toLocaleDateString()}</span>
                            {s.grade != null
                              ? <span className="text-green-600 font-semibold">{s.grade}/20</span>
                              : <span className="text-amber-500">Not graded</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════
// ATTENDANCE TAB
// ════════════════════════════════════
function AttendanceTab({ teacherId }: { teacherId: number }) {
  const lecs = getTeacherLectures(teacherId);
  const [selectedLecId, setSelectedLecId] = useState(lecs[0]?.id ?? 0);
  const selectedLec = lecs.find(l => l.id === selectedLecId);
  const sub = selectedLec ? getSubjectById(selectedLec.subjectId) : undefined;
  const studentList = sub ? getSubjectStudents(sub.id) : [];
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState(false);

  const toggle = (id: number) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  const markAll = (val: boolean) => {
    const next: Record<number, boolean> = {};
    studentList.forEach(s => { next[s.id] = val; });
    setAttendance(next);
  };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const presentCount = studentList.filter(s => attendance[s.id] === true).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <label className="text-xs text-slate-500 block mb-2">Select Lecture</label>
        <div className="flex gap-2 flex-wrap">
          {lecs.map(l => {
            const s = getSubjectById(l.subjectId);
            return (
              <button key={l.id} onClick={() => { setSelectedLecId(l.id); setAttendance({}); setSaved(false); }}
                className={`px-4 py-2 rounded-lg text-sm border transition ${selectedLecId === l.id ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"}`}>
                {s?.name} · {l.day} {l.startTime}
              </button>
            );
          })}
        </div>
      </div>

      {selectedLec && sub && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-slate-800">{sub.name} – Attendance</h2>
              <p className="text-xs text-slate-500">{selectedLec.day} {selectedLec.startTime} · Year {sub.year} · {sub.department}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{presentCount}/{studentList.length} present</span>
              <button onClick={() => markAll(true)} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">All Present</button>
              <button onClick={() => markAll(false)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">All Absent</button>
            </div>
          </div>
          {saved && <div className="mx-5 mt-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 text-sm">✅ Attendance saved successfully.</div>}
          <div className="divide-y">
            {studentList.map(st => {
              const isPresent = attendance[st.id] === true;
              const isAbsent  = attendance[st.id] === false;
              return (
                <div key={st.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Image src={st.photo} alt={st.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{st.name}</p>
                      <p className="text-xs text-slate-400">ID: {st.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAttendance(p => ({ ...p, [st.id]: true }))}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${isPresent ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-500 border-slate-300 hover:border-green-400"}`}>
                      Present
                    </button>
                    <button onClick={() => setAttendance(p => ({ ...p, [st.id]: false }))}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${isAbsent ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-500 border-slate-300 hover:border-red-400"}`}>
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t flex justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition">
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════
// MESSAGES TAB
// ════════════════════════════════════
function MessagesTab({ teacherId }: { teacherId: number }) {
  const myAssistants = getTeacherAssistants(teacherId);
  const allStudents = [...new Set(getTeacherSubjects(teacherId).flatMap(s => getSubjectStudents(s.id)))];

  type Contact = { id: string; name: string; photo: string; type: string };
  const contacts: Contact[] = [
    ...myAssistants.map(a => ({ id: `assistant-${a.id}`, name: a.name, photo: a.photo, type: "Assistant" })),
    ...allStudents.map(s => ({ id: `student-${s.id}`, name: s.name, photo: s.photo, type: "Student" })),
    { id: "admin", name: "University Admin", photo: "/avatar.png", type: "Admin" },
  ];

  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? "");
  const [text, setText] = useState("");
  const [chat, setChat] = useState<{ from: "me"|"them"; text: string; time: string }[]>([
    { from: "them", text: "Hello Dr. Mohamed, I'll be ready for the lab session.", time: "10:15" },
  ]);

  const send = () => {
    if (!text.trim()) return;
    setChat(c => [...c, { from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  };

  const selected = contacts.find(c => c.id === selectedId);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex h-[600px]">
      {/* Contact List */}
      <div className="w-64 border-r flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contacts</p>
        </div>
        <div className="overflow-y-auto flex-1">
          {contacts.map(c => (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-50 transition ${selectedId === c.id ? "bg-blue-50" : ""}`}>
              <Image src={c.photo} alt={c.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-400">{c.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 border-b flex items-center gap-3">
          {selected && <><Image src={selected.photo} alt={selected.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            <div><p className="font-semibold text-slate-800 text-sm">{selected.name}</p><p className="text-xs text-slate-400">{selected.type}</p></div></>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.from === "me" ? "text-blue-200" : "text-slate-400"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button onClick={send} className="px-5 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition">Send</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════
// ANNOUNCEMENTS TAB
// ════════════════════════════════════
function AnnouncementsTab({ teacherId }: { teacherId: number }) {
  const subs = getTeacherSubjects(teacherId);
  const existing = allAnnouncements.filter(a => a.fromId === `teacher-${teacherId}`);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetSubId, setTargetSubId] = useState(subs[0]?.id ?? 0);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true); setTitle(""); setBody("");
    setTimeout(() => setSent(false), 3000);
  };

  const targetSub = subs.find(s => s.id === targetSubId);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <h3 className="font-semibold text-slate-800">Send Announcement</h3>
        {sent && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 text-sm">✅ Announcement sent to students.</div>}
        <div>
          <label className="text-xs text-slate-500 block mb-1">Target (Year & Department)</label>
          <select value={targetSubId} onChange={e => setTargetSubId(+e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            {subs.map(s => <option key={s.id} value={s.id}>Year {s.year} · {s.department} ({s.name})</option>)}
          </select>
          {targetSub && <p className="text-xs text-slate-400 mt-1">→ Will be sent to {getSubjectStudents(targetSub.id).length} students</p>}
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title"
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Message</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your announcement..."
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
        </div>
        <div className="flex justify-end">
          <button onClick={handleSend} disabled={!title || !body}
            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            📢 Send Announcement
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-slate-600 text-sm">Sent Announcements</h3>
        {existing.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">Year {a.targetYear} · {a.targetDepartment} · {new Date(a.sentAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Sent</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

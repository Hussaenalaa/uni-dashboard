"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  universityTeachers,
  getTeacherStudents,
  getTeacherLectures,
  getTeacherAssistants,
  getTeacherExams,
  getTeacherAssignments,
  universityStudents,
  lectures as allLectures,
  attendanceRecords,
  universityMessages,
  universityAnnouncements,
  assignmentSubmissions,
  examResults,
  type Lecture,
  type LectureMode,
  type Exam,
  type ExamQuestion,
  type QuestionType,
  type Assignment,
  type AttendanceRecord,
  type Message,
  type Announcement,
  type Department,
  type Year,
} from "@/lib/university-data";

type Tab = "students" | "classes" | "assistants" | "exams" | "assignments" | "attendance" | "messages" | "announcements";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "students",      label: "Students",      icon: "/student.png" },
  { key: "classes",        label: "Classes",        icon: "/class.png" },
  { key: "assistants",     label: "Assistants",     icon: "/parent.png" },
  { key: "exams",          label: "Exams",          icon: "/exam.png" },
  { key: "assignments",    label: "Assignments",    icon: "/assignment.png" },
  { key: "attendance",     label: "Attendance",     icon: "/attendance.png" },
  { key: "messages",       label: "Messages",       icon: "/message.png" },
  { key: "announcements",  label: "Announcements",  icon: "/announcement.png" },
];

// ═══════════════════════════════════════════════════════════
// STUDENTS TAB
// ═══════════════════════════════════════════════════════════
function StudentsTab({ teacherId }: { teacherId: number }) {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  const students = getTeacherStudents(teacherId);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  if (!teacher) return <p className="text-gray-500">Teacher not found.</p>;

  const years = [...new Set(teacher.subjects.map((s) => s.year))].sort();
  const subjects = teacher.subjects.map((s) => s.name);

  let filtered = students;
  if (filterYear !== "all") {
    filtered = filtered.filter((s) => s.year === Number(filterYear));
  }
  if (filterSubject !== "all") {
    const subj = teacher.subjects.find((s) => s.name === filterSubject);
    if (subj) {
      filtered = filtered.filter(
        (s) => s.department === subj.department && s.year === subj.year
      );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="p-3">Student</th>
                <th className="p-3">ID</th>
                <th className="p-3">Department</th>
                <th className="p-3">Year</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <Image src={s.photo} alt={s.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                    {s.name}
                  </td>
                  <td className="p-3">{s.studentId}</td>
                  <td className="p-3">{s.department}</td>
                  <td className="p-3">{s.year}</td>
                  <td className="p-3">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLASSES TAB
// ═══════════════════════════════════════════════════════════
function ClassesTab({ teacherId }: { teacherId: number }) {
  const teacherLectures = getTeacherLectures(teacherId);
  const [localLectures, setLocalLectures] = useState<Lecture[]>(teacherLectures);
  const [viewMode, setViewMode] = useState<"today" | "week">("week");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ day: "", startTime: "", endTime: "", hall: "" });

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const todayIdx = new Date().getDay();
  const dayMap: Record<number, string> = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  const todayName = dayMap[todayIdx];

  const displayed = viewMode === "today"
    ? localLectures.filter((l) => l.day === todayName)
    : localLectures;

  function toggleMode(id: number) {
    setLocalLectures((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, mode: l.mode === "offline" ? "online" : "offline" } : l
      )
    );
  }

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
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("today")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === "today" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Today
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === "week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          This Week
        </button>
      </div>

      {displayed.length === 0 ? (
        <p className="text-gray-400 text-sm">No lectures {viewMode === "today" ? "today" : "this week"}.</p>
      ) : (
        <div className="space-y-3">
          {days.map((day) => {
            const dayLectures = displayed.filter((l) => l.day === day);
            if (dayLectures.length === 0) return null;
            return (
              <div key={day}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{day}</h4>
                <div className="space-y-2">
                  {dayLectures.map((l) => (
                    <div key={l.id} className="bg-gray-50 border rounded-lg p-4">
                      {editingId === l.id ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <select value={editForm.day} onChange={(e) => setEditForm({ ...editForm, day: e.target.value })} className="border rounded px-2 py-1 text-sm">
                              {days.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} className="border rounded px-2 py-1 text-sm" />
                            <input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} className="border rounded px-2 py-1 text-sm" />
                            <input type="text" value={editForm.hall} onChange={(e) => setEditForm({ ...editForm, hall: e.target.value })} className="border rounded px-2 py-1 text-sm" placeholder="Hall" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(l.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-gray-800">{l.subject}</p>
                            <p className="text-xs text-gray-500">
                              {l.startTime} - {l.endTime} · {l.hall} · {l.department} Year {l.year}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.mode === "online" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                              {l.mode === "online" ? "Online" : "Offline"}
                            </span>
                            <button onClick={() => toggleMode(l.id)} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">
                              Switch to {l.mode === "online" ? "Offline" : "Online"}
                            </button>
                            <button onClick={() => startEdit(l)} className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                              Reschedule
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
// ASSISTANTS TAB
// ═══════════════════════════════════════════════════════════
function AssistantsTab({ teacherId }: { teacherId: number }) {
  const assistants = getTeacherAssistants(teacherId);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("all");

  const years = [...new Set(assistants.map((a) => a.year))].sort();
  const depts = [...new Set(assistants.map((a) => a.department))];

  let filtered = assistants;
  if (filterYear !== "all") filtered = filtered.filter((a) => a.year === Number(filterYear));
  if (filterDept !== "all") filtered = filtered.filter((a) => a.department === filterDept);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">All Years</option>
          {years.map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          {depts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">No assistants found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-gray-50 border rounded-lg p-4 flex items-start gap-3">
              <Image src={a.photo} alt={a.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-medium text-gray-800">{a.name}</p>
                <p className="text-xs text-gray-500">{a.department} - Year {a.year}</p>
                <p className="text-xs text-gray-500">{a.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {a.subjects.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
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
// EXAMS TAB
// ═══════════════════════════════════════════════════════════
function ExamsTab({ teacherId }: { teacherId: number }) {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  const exams = getTeacherExams(teacherId);
  const [showCreate, setShowCreate] = useState(false);
  const [localExams, setLocalExams] = useState<Exam[]>(exams);
  const [viewingExam, setViewingExam] = useState<number | null>(null);

  // Create exam form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDept, setNewDept] = useState<Department>("IT");
  const [newYear, setNewYear] = useState<Year>(1);
  const [newDate, setNewDate] = useState("");
  const [newDuration, setNewDuration] = useState(60);
  const [newTotalMarks, setNewTotalMarks] = useState(30);
  const [mcqCount, setMcqCount] = useState(2);
  const [tfCount, setTfCount] = useState(2);
  const [essayCount, setEssayCount] = useState(1);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [step, setStep] = useState<"config" | "questions">("config");

  function generateQuestionSlots() {
    const qs: ExamQuestion[] = [];
    let qId = 1;
    for (let i = 0; i < mcqCount; i++) {
      qs.push({ id: qId++, type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "" });
    }
    for (let i = 0; i < tfCount; i++) {
      qs.push({ id: qId++, type: "true_false", text: "", correctAnswer: true });
    }
    for (let i = 0; i < essayCount; i++) {
      qs.push({ id: qId++, type: "essay", text: "" });
    }
    setQuestions(qs);
    setStep("questions");
  }

  function updateQuestion(idx: number, field: string, value: string | boolean) {
    setQuestions((prev) => {
      const copy = [...prev];
      if (field === "text") copy[idx] = { ...copy[idx], text: value as string };
      else if (field === "correctAnswer") copy[idx] = { ...copy[idx], correctAnswer: value };
      return copy;
    });
  }

  function updateOption(qIdx: number, optIdx: number, value: string) {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...(copy[qIdx].options || [])];
      opts[optIdx] = value;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  }

  function submitExam() {
    const newExam: Exam = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      teacherId,
      department: newDept,
      year: newYear,
      date: newDate,
      duration: newDuration,
      totalMarks: newTotalMarks,
      questions,
    };
    setLocalExams((prev) => [...prev, newExam]);
    setShowCreate(false);
    setStep("config");
    setNewTitle("");
    setQuestions([]);
  }

  const viewExam = viewingExam !== null ? localExams.find((e) => e.id === viewingExam) : null;

  return (
    <div>
      {viewExam ? (
        <div>
          <button onClick={() => setViewingExam(null)} className="text-sm text-blue-600 mb-4 hover:underline">&larr; Back to exams</button>
          <h3 className="text-lg font-semibold mb-2">{viewExam.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{viewExam.subject} · {viewExam.department} Year {viewExam.year} · {viewExam.date} · {viewExam.duration} min · {viewExam.totalMarks} marks</p>
          <div className="space-y-4">
            {viewExam.questions.map((q, i) => (
              <div key={q.id} className="bg-gray-50 border rounded-lg p-4">
                <p className="font-medium text-sm">Q{i + 1} ({q.type === "mcq" ? "MCQ" : q.type === "true_false" ? "True/False" : "Essay"})</p>
                <p className="text-sm mt-1">{q.text}</p>
                {q.type === "mcq" && q.options && (
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <li key={oi} className={`text-sm pl-3 ${opt === q.correctAnswer ? "text-green-600 font-medium" : "text-gray-600"}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === "true_false" && (
                  <p className="text-sm mt-1 text-green-600">Answer: {q.correctAnswer ? "True" : "False"}</p>
                )}
              </div>
            ))}
          </div>

          {/* Results for this exam */}
          <h4 className="text-md font-semibold mt-6 mb-2">Student Results</h4>
          {examResults.filter((r) => r.examId === viewExam.id).length === 0 ? (
            <p className="text-gray-400 text-sm">No results yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-2">Student</th><th className="p-2">Score</th><th className="p-2">Total</th><th className="p-2">%</th></tr></thead>
              <tbody>
                {examResults.filter((r) => r.examId === viewExam.id).map((r) => (
                  <tr key={r.id} className="border-b"><td className="p-2">{r.studentName}</td><td className="p-2">{r.score}</td><td className="p-2">{r.totalMarks}</td><td className="p-2">{Math.round((r.score / r.totalMarks) * 100)}%</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : showCreate ? (
        <div>
          <button onClick={() => { setShowCreate(false); setStep("config"); }} className="text-sm text-blue-600 mb-4 hover:underline">&larr; Back</button>
          {step === "config" ? (
            <div className="space-y-3 max-w-lg">
              <h3 className="text-lg font-semibold">Create New Exam</h3>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Exam Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                <option value="">Select Subject</option>
                {teacher?.subjects.map((s) => <option key={s.name} value={s.name}>{s.name} ({s.department} - Year {s.year})</option>)}
              </select>
              <div className="flex gap-2">
                <select className="border rounded-lg px-3 py-2 text-sm" value={newDept} onChange={(e) => setNewDept(e.target.value as Department)}>
                  <option value="IT">IT</option><option value="CS">CS</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm" value={newYear} onChange={(e) => setNewYear(Number(e.target.value) as Year)}>
                  {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" className="border rounded-lg px-3 py-2 text-sm w-32" placeholder="Duration (min)" value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))} />
                <input type="number" className="border rounded-lg px-3 py-2 text-sm w-32" placeholder="Total Marks" value={newTotalMarks} onChange={(e) => setNewTotalMarks(Number(e.target.value))} />
              </div>
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm font-medium mb-2">Question Types & Count</p>
                <div className="flex flex-wrap gap-3">
                  <label className="text-sm flex items-center gap-1">MCQ: <input type="number" min={0} value={mcqCount} onChange={(e) => setMcqCount(Number(e.target.value))} className="border rounded px-2 py-1 w-16 text-sm" /></label>
                  <label className="text-sm flex items-center gap-1">True/False: <input type="number" min={0} value={tfCount} onChange={(e) => setTfCount(Number(e.target.value))} className="border rounded px-2 py-1 w-16 text-sm" /></label>
                  <label className="text-sm flex items-center gap-1">Essay: <input type="number" min={0} value={essayCount} onChange={(e) => setEssayCount(Number(e.target.value))} className="border rounded px-2 py-1 w-16 text-sm" /></label>
                </div>
              </div>
              <button onClick={generateQuestionSlots} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Next: Write Questions</button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Write Questions</h3>
              {questions.map((q, i) => (
                <div key={q.id} className="bg-gray-50 border rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase">
                    {q.type === "mcq" ? "Multiple Choice" : q.type === "true_false" ? "True / False" : "Essay"} - Q{i + 1}
                  </p>
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm mb-2"
                    placeholder="Question text..."
                    value={q.text}
                    onChange={(e) => updateQuestion(i, "text", e.target.value)}
                    rows={2}
                  />
                  {q.type === "mcq" && (
                    <div className="space-y-1">
                      {(q.options || []).map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500 w-6">{String.fromCharCode(65 + oi)}.</span>
                          <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => updateOption(i, oi, e.target.value)} />
                          <input type="radio" name={`correct-${i}`} checked={q.correctAnswer === opt && opt !== ""} onChange={() => updateQuestion(i, "correctAnswer", opt)} />
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === "true_false" && (
                    <div className="flex gap-4">
                      <label className="text-sm flex items-center gap-1">
                        <input type="radio" name={`tf-${i}`} checked={q.correctAnswer === true} onChange={() => updateQuestion(i, "correctAnswer", true)} /> True
                      </label>
                      <label className="text-sm flex items-center gap-1">
                        <input type="radio" name={`tf-${i}`} checked={q.correctAnswer === false} onChange={() => updateQuestion(i, "correctAnswer", false)} /> False
                      </label>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={submitExam} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Create Exam</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4">
            + Create New Exam
          </button>
          {localExams.length === 0 ? (
            <p className="text-gray-400 text-sm">No exams yet.</p>
          ) : (
            <div className="space-y-3">
              {localExams.map((e) => (
                <div key={e.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => setViewingExam(e.id)}>
                  <div>
                    <p className="font-medium text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.subject} · {e.department} Year {e.year} · {e.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{e.totalMarks} marks</p>
                    <p className="text-xs text-gray-500">{e.duration} min · {e.questions.length} questions</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ASSIGNMENTS TAB
// ═══════════════════════════════════════════════════════════
function AssignmentsTab({ teacherId }: { teacherId: number }) {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  const assignments = getTeacherAssignments(teacherId);
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(assignments);
  const [showCreate, setShowCreate] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDept, setNewDept] = useState<Department>("IT");
  const [newYear, setNewYear] = useState<Year>(1);
  const [newDue, setNewDue] = useState("");
  const [hasPdf, setHasPdf] = useState(false);

  function createAssignment() {
    const a: Assignment = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      subject: newSubject,
      teacherId,
      department: newDept,
      year: newYear,
      dueDate: newDue,
      hasPdf,
      pdfName: hasPdf ? "attachment.pdf" : undefined,
    };
    setLocalAssignments((prev) => [...prev, a]);
    setShowCreate(false);
    setNewTitle(""); setNewDesc("");
  }

  const viewing = viewingId !== null ? localAssignments.find((a) => a.id === viewingId) : null;

  return (
    <div>
      {viewing ? (
        <div>
          <button onClick={() => setViewingId(null)} className="text-sm text-blue-600 mb-4 hover:underline">&larr; Back</button>
          <h3 className="text-lg font-semibold">{viewing.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{viewing.subject} · {viewing.department} Year {viewing.year} · Due: {viewing.dueDate}</p>
          <p className="text-sm text-gray-700 mb-4">{viewing.description}</p>
          {viewing.hasPdf && <p className="text-sm text-blue-600 mb-4">📎 {viewing.pdfName}</p>}
          <h4 className="text-md font-semibold mb-2">Submissions</h4>
          {assignmentSubmissions.filter((s) => s.assignmentId === viewing.id).length === 0 ? (
            <p className="text-gray-400 text-sm">No submissions yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="p-2">Student</th><th className="p-2">File</th><th className="p-2">Submitted</th></tr></thead>
              <tbody>
                {assignmentSubmissions.filter((s) => s.assignmentId === viewing.id).map((s) => (
                  <tr key={s.id} className="border-b"><td className="p-2">{s.studentName}</td><td className="p-2">{s.fileName}</td><td className="p-2">{new Date(s.submittedAt).toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : showCreate ? (
        <div className="space-y-3 max-w-lg">
          <button onClick={() => setShowCreate(false)} className="text-sm text-blue-600 mb-2 hover:underline">&larr; Back</button>
          <h3 className="text-lg font-semibold">Create New Assignment</h3>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} />
          <select className="w-full border rounded-lg px-3 py-2 text-sm" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {teacher?.subjects.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <div className="flex gap-2">
            <select className="border rounded-lg px-3 py-2 text-sm" value={newDept} onChange={(e) => setNewDept(e.target.value as Department)}>
              <option value="IT">IT</option><option value="CS">CS</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm" value={newYear} onChange={(e) => setNewYear(Number(e.target.value) as Year)}>
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasPdf} onChange={(e) => setHasPdf(e.target.checked)} /> Attach PDF
          </label>
          <button onClick={createAssignment} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Create Assignment</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4">
            + Create New Assignment
          </button>
          {localAssignments.length === 0 ? (
            <p className="text-gray-400 text-sm">No assignments yet.</p>
          ) : (
            <div className="space-y-3">
              {localAssignments.map((a) => (
                <div key={a.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => setViewingId(a.id)}>
                  <div>
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.subject} · {a.department} Year {a.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due: {a.dueDate}</p>
                    {a.hasPdf && <p className="text-xs text-blue-500">📎 PDF</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ATTENDANCE TAB
// ═══════════════════════════════════════════════════════════
function AttendanceTab({ teacherId }: { teacherId: number }) {
  const teacherLectures = getTeacherLectures(teacherId);
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);
  const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>([...attendanceRecords]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const lecture = selectedLecture !== null ? teacherLectures.find((l) => l.id === selectedLecture) : null;

  function getStudentsForLecture(lectureId: number) {
    const lec = teacherLectures.find((l) => l.id === lectureId);
    if (!lec) return [];
    return universityStudents.filter(
      (s) => s.department === lec.department && s.year === lec.year
    );
  }

  function toggleAttendance(studentId: number) {
    if (!selectedLecture) return;
    const existing = localAttendance.find(
      (a) => a.lectureId === selectedLecture && a.studentId === studentId && a.date === selectedDate
    );
    if (existing) {
      setLocalAttendance((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? { ...a, status: a.status === "present" ? "absent" : "present" }
            : a
        )
      );
    } else {
      setLocalAttendance((prev) => [
        ...prev,
        { id: Date.now() + studentId, lectureId: selectedLecture, studentId, date: selectedDate, status: "present" },
      ]);
    }
  }

  function getStatus(studentId: number): "present" | "absent" | "unmarked" {
    if (!selectedLecture) return "unmarked";
    const rec = localAttendance.find(
      (a) => a.lectureId === selectedLecture && a.studentId === studentId && a.date === selectedDate
    );
    return rec ? rec.status : "unmarked";
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border rounded-lg px-3 py-2 text-sm" value={selectedLecture ?? ""} onChange={(e) => setSelectedLecture(Number(e.target.value))}>
          <option value="">Select Lecture</option>
          {teacherLectures.map((l) => (
            <option key={l.id} value={l.id}>{l.subject} ({l.department} Year {l.year}) - {l.day}</option>
          ))}
        </select>
        <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {!selectedLecture ? (
        <p className="text-gray-400 text-sm">Select a lecture to take attendance.</p>
      ) : (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {lecture?.subject} · {lecture?.department} Year {lecture?.year} · {lecture?.day}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <th className="p-3">Student</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {getStudentsForLecture(selectedLecture).map((s) => {
                  const status = getStatus(s.id);
                  return (
                    <tr key={s.id} className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <Image src={s.photo} alt={s.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                        {s.name}
                      </td>
                      <td className="p-3">{s.studentId}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === "present" ? "bg-green-100 text-green-700" :
                          status === "absent" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          {status === "unmarked" ? "Not marked" : status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => toggleAttendance(s.id)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded">
                          {status === "present" ? "Mark Absent" : "Mark Present"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MESSAGES TAB
// ═══════════════════════════════════════════════════════════
function MessagesTab({ teacherId }: { teacherId: number }) {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  const [messages, setMessages] = useState<Message[]>(
    universityMessages.filter(
      (m) =>
        (m.toRole === "teacher" && m.toId === teacherId) ||
        (m.fromRole === "teacher" && m.fromId === teacherId)
    )
  );
  const [newMsg, setNewMsg] = useState("");
  const [toRole, setToRole] = useState<"assistant" | "admin" | "student">("student");
  const [toName, setToName] = useState("");

  function sendMessage() {
    if (!newMsg.trim() || !toName.trim()) return;
    const msg: Message = {
      id: Date.now(),
      fromId: teacherId,
      fromName: teacher?.name || "",
      fromRole: "teacher",
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
          <select className="border rounded px-3 py-2 text-sm" value={toRole} onChange={(e) => setToRole(e.target.value as "assistant" | "admin" | "student")}>
            <option value="student">Student</option>
            <option value="assistant">Assistant</option>
            <option value="admin">Admin</option>
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
            <div key={m.id} className={`border rounded-lg p-3 ${m.fromRole === "teacher" && m.fromId === teacherId ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
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
// ANNOUNCEMENTS TAB
// ═══════════════════════════════════════════════════════════
function AnnouncementsTab({ teacherId }: { teacherId: number }) {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    universityAnnouncements.filter((a) => a.fromRole === "teacher" && a.fromId === teacherId)
  );
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [targetDept, setTargetDept] = useState<Department | "all">("all");
  const [targetYear, setTargetYear] = useState<Year | undefined>(undefined);

  function createAnnouncement() {
    if (!newTitle.trim() || !newContent.trim()) return;
    const ann: Announcement = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      fromId: teacherId,
      fromName: teacher?.name || "",
      fromRole: "teacher",
      targetDepartment: targetDept,
      targetYear,
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [...prev, ann]);
    setShowCreate(false);
    setNewTitle(""); setNewContent("");
  }

  return (
    <div>
      {showCreate ? (
        <div className="space-y-3 max-w-lg">
          <button onClick={() => setShowCreate(false)} className="text-sm text-blue-600 mb-2 hover:underline">&larr; Back</button>
          <h3 className="text-lg font-semibold">Send Announcement</h3>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Announcement content..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <select className="border rounded-lg px-3 py-2 text-sm" value={targetDept} onChange={(e) => setTargetDept(e.target.value as Department | "all")}>
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="CS">CS</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm" value={targetYear ?? ""} onChange={(e) => setTargetYear(e.target.value ? Number(e.target.value) as Year : undefined)}>
              <option value="">All Years</option>
              {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <button onClick={createAnnouncement} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Send Announcement</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-4">
            + Send Announcement
          </button>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm">No announcements sent.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{a.title}</h4>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    To: {a.targetDepartment === "all" ? "All Departments" : a.targetDepartment}
                    {a.targetYear ? ` - Year ${a.targetYear}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
const SingleTeacherPage = () => {
  const params = useParams();
  const teacherId = Number(params.id);
  const [activeTab, setActiveTab] = useState<Tab>("students");

  const teacher = universityTeachers.find((t) => t.id === teacherId);
  if (!teacher) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p className="text-gray-500">Teacher not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Staff profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800 tracking-tight">Teacher Overview</h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="flex flex-col gap-6">
          {/* Profile card */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-emerald-400 to-teal-500" />
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4">
                <Image src={teacher.photo} alt={teacher.name} width={80} height={80} className="w-20 h-20 rounded-xl object-cover ring-4 ring-white shadow" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">{teacher.name}</h2>
              <p className="text-sm text-emerald-600 font-medium mt-0.5">
                {teacher.subjects.map((s) => s.department).filter((v, i, a) => a.indexOf(v) === i).join(" & ")} Dept.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                  </span>
                  {teacher.email}
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                  </span>
                  {teacher.phone}
                </li>
              </ul>
            </div>
          </div>

          {/* Subjects list */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Subjects</h3>
            <div className="space-y-2">
              {teacher.subjects.map((s) => (
                <div key={`${s.name}-${s.department}-${s.year}`} className="bg-gray-50 rounded-lg p-2 text-sm">
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.department} - Year {s.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{getTeacherStudents(teacherId).length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Students</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{getTeacherLectures(teacherId).length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Lectures</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{teacher.subjects.length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Subjects</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-2xl font-bold text-slate-800">{getTeacherAssistants(teacherId).length}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Assistants</p>
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
              {activeTab === "students" && <StudentsTab teacherId={teacherId} />}
              {activeTab === "classes" && <ClassesTab teacherId={teacherId} />}
              {activeTab === "assistants" && <AssistantsTab teacherId={teacherId} />}
              {activeTab === "exams" && <ExamsTab teacherId={teacherId} />}
              {activeTab === "assignments" && <AssignmentsTab teacherId={teacherId} />}
              {activeTab === "attendance" && <AttendanceTab teacherId={teacherId} />}
              {activeTab === "messages" && <MessagesTab teacherId={teacherId} />}
              {activeTab === "announcements" && <AnnouncementsTab teacherId={teacherId} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleTeacherPage;

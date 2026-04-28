// ═══════════════════════════════════════════════
// University System – Comprehensive Mock Data
// ═══════════════════════════════════════════════

export const DEPARTMENTS = ["Computer Science", "Information Technology", "Software Engineering"];
export const YEARS = [1, 2, 3, 4] as const;
export type Year = 1 | 2 | 3 | 4;
export type LectureMode = "offline" | "online";
export type QuestionType = "mcq" | "truefalse" | "essay";
export type ExamStatus = "upcoming" | "active" | "graded";

// ─── Subjects ───────────────────────────────────
export interface Subject {
  id: number; name: string; code: string;
  year: Year; department: string; hours: number; teacherId: number;
}
export const subjects: Subject[] = [
  { id: 1, name: "Data Structures", code: "CS201", year: 2, department: "Computer Science", hours: 3, teacherId: 1 },
  { id: 2, name: "Algorithms", code: "CS301", year: 3, department: "Computer Science", hours: 3, teacherId: 1 },
  { id: 3, name: "Database Systems", code: "CS302", year: 3, department: "Computer Science", hours: 3, teacherId: 1 },
  { id: 4, name: "Physics I", code: "PH101", year: 1, department: "Computer Science", hours: 3, teacherId: 2 },
  { id: 5, name: "Physics II", code: "PH201", year: 2, department: "Computer Science", hours: 3, teacherId: 2 },
];

// ─── Teachers ───────────────────────────────────
export interface Teacher {
  id: number; name: string; email: string; photo: string;
  phone: string; department: string; joinDate: string; bloodType: string;
}
export const teachers: Teacher[] = [
  { id: 1, name: "Dr. Mohamed Shalaby", email: "m.shalaby@uni.edu", photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 100 123 4567", department: "Computer Science", joinDate: "Sep 2018", bloodType: "O+" },
  { id: 2, name: "Dr. Sherif El-Shorbagy", email: "s.shorbagy@uni.edu", photo: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 101 234 5678", department: "Computer Science", joinDate: "Jan 2015", bloodType: "A+" },
];

// ─── Assistants (معيدين) ─────────────────────────
export interface Assistant {
  id: number; name: string; email: string; photo: string;
  phone: string; subjectId: number; year: Year; department: string;
}
export const assistants: Assistant[] = [
  { id: 1, name: "Ahmed Hassan", email: "a.hassan@uni.edu", photo: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 102 111 2222", subjectId: 1, year: 2, department: "Computer Science" },
  { id: 2, name: "Sara Mahmoud", email: "s.mahmoud@uni.edu", photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 103 222 3333", subjectId: 1, year: 2, department: "Computer Science" },
  { id: 3, name: "Omar Khaled", email: "o.khaled@uni.edu", photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 104 333 4444", subjectId: 2, year: 3, department: "Computer Science" },
  { id: 4, name: "Nour Adel", email: "n.adel@uni.edu", photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 105 444 5555", subjectId: 3, year: 3, department: "Computer Science" },
];

// ─── Students ───────────────────────────────────
export interface Student {
  id: number; name: string; email: string; photo: string;
  phone: string; year: Year; department: string; gpa: number;
  enrollDate: string; bloodType: string;
}
export const students: Student[] = [
  { id: 101, name: "Ali Mohamed", email: "ali.m@uni.edu", photo: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0001", year: 2, department: "Computer Science", gpa: 3.7, enrollDate: "Sep 2023", bloodType: "A+" },
  { id: 102, name: "Fatima Hassan", email: "fatima.h@uni.edu", photo: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0002", year: 2, department: "Computer Science", gpa: 3.9, enrollDate: "Sep 2023", bloodType: "B+" },
  { id: 103, name: "Youssef Kamal", email: "y.kamal@uni.edu", photo: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0003", year: 2, department: "Computer Science", gpa: 3.2, enrollDate: "Sep 2023", bloodType: "O+" },
  { id: 104, name: "Mariam Adel", email: "m.adel@uni.edu", photo: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0004", year: 2, department: "Computer Science", gpa: 3.5, enrollDate: "Sep 2023", bloodType: "AB+" },
  { id: 105, name: "Karim Samir", email: "k.samir@uni.edu", photo: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0005", year: 2, department: "Computer Science", gpa: 2.9, enrollDate: "Sep 2023", bloodType: "A-" },
  { id: 201, name: "Nada Ibrahim", email: "n.ibrahim@uni.edu", photo: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0006", year: 3, department: "Computer Science", gpa: 3.8, enrollDate: "Sep 2022", bloodType: "O-" },
  { id: 202, name: "Hassan Ali", email: "h.ali@uni.edu", photo: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0007", year: 3, department: "Computer Science", gpa: 3.4, enrollDate: "Sep 2022", bloodType: "B-" },
  { id: 203, name: "Dina Samy", email: "d.samy@uni.edu", photo: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400", phone: "+20 111 000 0008", year: 3, department: "Computer Science", gpa: 3.6, enrollDate: "Sep 2022", bloodType: "A+" },
];

// ─── Lectures ───────────────────────────────────
export type WeekDay = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
export interface Lecture {
  id: number; teacherId: number; subjectId: number;
  day: WeekDay; startTime: string; durationMin: number;
  room: string; mode: LectureMode; onlineLink?: string;
}
export const lectures: Lecture[] = [
  { id: 1, teacherId: 1, subjectId: 1, day: "Sunday",    startTime: "09:00", durationMin: 90, room: "Hall A101", mode: "offline" },
  { id: 2, teacherId: 1, subjectId: 1, day: "Tuesday",   startTime: "11:00", durationMin: 90, room: "Hall A101", mode: "offline" },
  { id: 3, teacherId: 1, subjectId: 2, day: "Monday",    startTime: "09:00", durationMin: 90, room: "Hall B202", mode: "offline" },
  { id: 4, teacherId: 1, subjectId: 2, day: "Wednesday", startTime: "13:00", durationMin: 90, room: "Hall B202", mode: "offline" },
  { id: 5, teacherId: 1, subjectId: 3, day: "Thursday",  startTime: "10:00", durationMin: 90, room: "Lab C305", mode: "offline" },
];

// ─── Exams ──────────────────────────────────────
export interface Question { id: number; type: QuestionType; text: string; options?: string[]; answer?: string; points: number; }
export interface Exam {
  id: number; teacherId: number; subjectId: number;
  title: string; year: Year; department: string;
  date: string; durationMin: number; status: ExamStatus;
  questions: Question[];
}
export const exams: Exam[] = [
  {
    id: 1, teacherId: 1, subjectId: 1,
    title: "Data Structures – Midterm", year: 2, department: "Computer Science",
    date: "2025-05-15", durationMin: 90, status: "upcoming",
    questions: [
      { id: 1, type: "mcq", text: "Which data structure uses LIFO?", options: ["Queue","Stack","Tree","Graph"], answer: "Stack", points: 2 },
      { id: 2, type: "mcq", text: "Time complexity of binary search?", options: ["O(n)","O(log n)","O(n²)","O(1)"], answer: "O(log n)", points: 2 },
      { id: 3, type: "truefalse", text: "A linked list allows O(1) random access.", answer: "False", points: 1 },
      { id: 4, type: "truefalse", text: "A stack can be implemented using an array.", answer: "True", points: 1 },
      { id: 5, type: "essay", text: "Explain the difference between BFS and DFS with examples.", points: 5 },
    ],
  },
  {
    id: 2, teacherId: 1, subjectId: 2,
    title: "Algorithms – Quiz 1", year: 3, department: "Computer Science",
    date: "2025-05-08", durationMin: 45, status: "graded",
    questions: [
      { id: 1, type: "mcq", text: "Best case of bubble sort?", options: ["O(n)","O(n log n)","O(n²)","O(1)"], answer: "O(n)", points: 2 },
      { id: 2, type: "essay", text: "Describe divide-and-conquer strategy.", points: 5 },
    ],
  },
];

// ─── Assignments ─────────────────────────────────
export interface AssignmentSubmission { studentId: number; submittedAt: string; fileUrl: string; grade?: number; }
export interface Assignment {
  id: number; teacherId: number; subjectId: number;
  title: string; description: string; year: Year; department: string;
  deadline: string; pdfUrl?: string;
  submissions: AssignmentSubmission[];
}
export const assignments: Assignment[] = [
  {
    id: 1, teacherId: 1, subjectId: 1,
    title: "Assignment 1: Implement a Linked List",
    description: "Implement a singly linked list with insert, delete, and search operations in Python. Include test cases.",
    year: 2, department: "Computer Science",
    deadline: "2025-05-20T23:59:00",
    submissions: [
      { studentId: 101, submittedAt: "2025-05-18T14:30:00", fileUrl: "/submissions/ali_ll.pdf", grade: 18 },
      { studentId: 102, submittedAt: "2025-05-19T09:00:00", fileUrl: "/submissions/fatima_ll.pdf" },
    ],
  },
  {
    id: 2, teacherId: 1, subjectId: 2,
    title: "Assignment 2: Sorting Algorithms Comparison",
    description: "Compare bubble sort, merge sort, and quicksort. Measure time on arrays of size 100, 1000, 10000.",
    year: 3, department: "Computer Science",
    deadline: "2025-05-25T23:59:00",
    pdfUrl: "/pdfs/sorting_assignment.pdf",
    submissions: [],
  },
];

// ─── Attendance Records ──────────────────────────
export interface AttendanceRecord { lectureId: number; date: string; records: { studentId: number; present: boolean }[]; }
export const attendanceRecords: AttendanceRecord[] = [
  {
    lectureId: 1, date: "2025-04-27",
    records: [
      { studentId: 101, present: true },
      { studentId: 102, present: true },
      { studentId: 103, present: false },
      { studentId: 104, present: true },
      { studentId: 105, present: true },
    ],
  },
];

// ─── Events ─────────────────────────────────────
export interface UniEvent { id: number; title: string; date: string; type: "holiday" | "competition" | "seminar" | "general"; description: string; }
export const events: UniEvent[] = [
  { id: 1, title: "Labor Day – Official Holiday", date: "2025-05-01", type: "holiday", description: "University closed for Labor Day." },
  { id: 2, title: "ICPC Programming Contest", date: "2025-05-10", type: "competition", description: "Annual programming competition open to all CS students." },
  { id: 3, title: "AI & Machine Learning Seminar", date: "2025-05-14", type: "seminar", description: "Guest lecture by industry experts. Hall A, 3 PM." },
  { id: 4, title: "Mid-Year Student Fair", date: "2025-05-22", type: "general", description: "Projects and activities showcase by student clubs." },
];

// ─── Messages ────────────────────────────────────
export interface Message { id: number; fromId: string; toId: string; text: string; sentAt: string; read: boolean; }
export const messages: Message[] = [
  { id: 1, fromId: "teacher-1", toId: "assistant-1", text: "Please prepare the lab session for next Tuesday.", sentAt: "2025-04-26T10:00:00", read: true },
  { id: 2, fromId: "assistant-1", toId: "teacher-1", text: "Sure, I'll prepare the material and the environment.", sentAt: "2025-04-26T10:15:00", read: true },
  { id: 3, fromId: "student-101", toId: "teacher-1", text: "Dr. Mohamed, can I get an extension for assignment 1?", sentAt: "2025-04-26T14:00:00", read: false },
];

// ─── Announcements ───────────────────────────────
export interface Announcement { id: number; fromId: string; fromName: string; targetYear?: Year; targetDepartment?: string; title: string; body: string; sentAt: string; }
export const announcements: Announcement[] = [
  { id: 1, fromId: "teacher-1", fromName: "Dr. Mohamed Shalaby", targetYear: 2, targetDepartment: "Computer Science", title: "Midterm Exam Schedule", body: "The Data Structures midterm will be on May 15 at 9 AM in Hall A. Bring your student ID.", sentAt: "2025-04-25T09:00:00" },
  { id: 2, fromId: "teacher-1", fromName: "Dr. Mohamed Shalaby", targetYear: 3, targetDepartment: "Computer Science", title: "Assignment 2 Posted", body: "Assignment 2 on sorting algorithms has been posted. Deadline: May 25.", sentAt: "2025-04-26T11:00:00" },
  { id: 3, fromId: "admin", fromName: "University Admin", targetDepartment: "Computer Science", title: "System Maintenance", body: "The university portal will be down for maintenance on April 30, 11 PM – 2 AM.", sentAt: "2025-04-24T08:00:00" },
];

// ─── Helper fns ──────────────────────────────────
export function getTeacherSubjects(teacherId: number) {
  return subjects.filter(s => s.teacherId === teacherId);
}
export function getSubjectStudents(subjectId: number) {
  const sub = subjects.find(s => s.id === subjectId);
  if (!sub) return [];
  return students.filter(s => s.year === sub.year && s.department === sub.department);
}
export function getTeacherLectures(teacherId: number) {
  return lectures.filter(l => l.teacherId === teacherId);
}
export function getTeacherAssistants(teacherId: number) {
  const subIds = getTeacherSubjects(teacherId).map(s => s.id);
  return assistants.filter(a => subIds.includes(a.subjectId));
}
export function getTeacherExams(teacherId: number) {
  return exams.filter(e => e.teacherId === teacherId);
}
export function getTeacherAssignments(teacherId: number) {
  return assignments.filter(a => a.teacherId === teacherId);
}
export function getStudentExams(student: Student) {
  return exams.filter(e => e.year === student.year && e.department === student.department);
}
export function getStudentAssignments(student: Student) {
  return assignments.filter(a => a.year === student.year && a.department === student.department);
}
export function getStudentAttendance(studentId: number) {
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.records.find(rec => rec.studentId === studentId && rec.present)).length;
  return { present, absent: total - present, total };
}
export function getStudentResults(studentId: number) {
  // Mock grades per exam
  const gradeMap: Record<number, number> = { 1: 78, 2: 85 };
  return exams.map(e => ({ exam: e, grade: gradeMap[e.id] ?? null }));
}
export function getSubjectById(id: number) { return subjects.find(s => s.id === id); }

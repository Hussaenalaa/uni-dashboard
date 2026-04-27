// ============================================================
// University-specific mock data for teacher/student/admin views
// ============================================================

// ── Types ──────────────────────────────────────────────────
export type Department = "IT" | "CS";
export type Year = 1 | 2 | 3 | 4;
export type LectureMode = "offline" | "online";

export interface UniversityStudent {
  id: number;
  name: string;
  email: string;
  photo: string;
  phone: string;
  department: Department;
  year: Year;
  studentId: string;
}

export interface UniversityTeacher {
  id: number;
  name: string;
  email: string;
  photo: string;
  phone: string;
  subjects: { name: string; department: Department; year: Year }[];
}

export interface Assistant {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string;
  department: Department;
  year: Year;
  subjects: string[];
}

export interface Lecture {
  id: number;
  subject: string;
  teacherId: number;
  department: Department;
  year: Year;
  hall: string;
  day: "Saturday" | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  startTime: string;
  endTime: string;
  mode: LectureMode;
}

export type QuestionType = "mcq" | "true_false" | "essay";

export interface ExamQuestion {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | boolean;
}

export interface Exam {
  id: number;
  title: string;
  subject: string;
  teacherId: number;
  department: Department;
  year: Year;
  date: string;
  duration: number; // minutes
  questions: ExamQuestion[];
  totalMarks: number;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  teacherId: number;
  department: Department;
  year: Year;
  dueDate: string;
  hasPdf: boolean;
  pdfName?: string;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  submittedAt: string;
  fileName: string;
}

export interface AttendanceRecord {
  id: number;
  lectureId: number;
  studentId: number;
  date: string;
  status: "present" | "absent";
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  studentName: string;
  score: number;
  totalMarks: number;
}

export interface Message {
  id: number;
  fromId: number;
  fromName: string;
  fromRole: "teacher" | "student" | "admin" | "assistant";
  toId: number;
  toName: string;
  toRole: "teacher" | "student" | "admin" | "assistant";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  fromId: number;
  fromName: string;
  fromRole: "teacher" | "admin";
  targetDepartment: Department | "all";
  targetYear?: Year;
  date: string;
}

export interface UniEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "holiday" | "competition" | "seminar" | "general";
  targetAudience: "all" | "students" | "teachers" | "staff";
}

// ── Mock Data ──────────────────────────────────────────────

export const universityStudents: UniversityStudent[] = [
  { id: 1,  name: "Ahmed Ali",       email: "ahmed.ali@uni.edu",       photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01001234567", department: "IT", year: 1, studentId: "IT-1-001" },
  { id: 2,  name: "Mohamed Hassan",  email: "mohamed.h@uni.edu",      photo: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",  phone: "01012345678", department: "IT", year: 1, studentId: "IT-1-002" },
  { id: 3,  name: "Sara Mahmoud",    email: "sara.m@uni.edu",         photo: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01023456789", department: "IT", year: 2, studentId: "IT-2-001" },
  { id: 4,  name: "Youssef Khaled",  email: "youssef.k@uni.edu",     photo: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",  phone: "01034567890", department: "IT", year: 2, studentId: "IT-2-002" },
  { id: 5,  name: "Nour Samir",      email: "nour.s@uni.edu",        photo: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",   phone: "01045678901", department: "IT", year: 3, studentId: "IT-3-001" },
  { id: 6,  name: "Omar Adel",       email: "omar.a@uni.edu",        photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01056789012", department: "IT", year: 3, studentId: "IT-3-002" },
  { id: 7,  name: "Laila Mostafa",   email: "laila.m@uni.edu",       photo: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01067890123", department: "IT", year: 4, studentId: "IT-4-001" },
  { id: 8,  name: "Hassan Ibrahim",  email: "hassan.i@uni.edu",      photo: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",  phone: "01078901234", department: "IT", year: 4, studentId: "IT-4-002" },
  { id: 9,  name: "Mona Fathy",      email: "mona.f@uni.edu",        photo: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01089012345", department: "CS", year: 1, studentId: "CS-1-001" },
  { id: 10, name: "Ali Mahmoud",     email: "ali.m@uni.edu",         photo: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01090123456", department: "CS", year: 1, studentId: "CS-1-002" },
  { id: 11, name: "Fatma Ahmed",     email: "fatma.a@uni.edu",       photo: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",   phone: "01101234567", department: "CS", year: 2, studentId: "CS-2-001" },
  { id: 12, name: "Karim Nasser",    email: "karim.n@uni.edu",       photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01112345678", department: "CS", year: 2, studentId: "CS-2-002" },
  { id: 13, name: "Aya Samir",       email: "aya.s@uni.edu",         photo: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01123456789", department: "CS", year: 3, studentId: "CS-3-001" },
  { id: 14, name: "Mahmoud Fathy",   email: "mahmoud.f@uni.edu",     photo: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",  phone: "01134567890", department: "CS", year: 3, studentId: "CS-3-002" },
  { id: 15, name: "Dina Khaled",     email: "dina.k@uni.edu",        photo: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01145678901", department: "CS", year: 4, studentId: "CS-4-001" },
  { id: 16, name: "Tarek Saeed",     email: "tarek.s@uni.edu",       photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", phone: "01156789012", department: "CS", year: 4, studentId: "CS-4-002" },
];

export const universityTeachers: UniversityTeacher[] = [
  {
    id: 1,
    name: "د. أحمد حسن",
    email: "ahmed.hassan@uni.edu",
    photo: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "01201234567",
    subjects: [
      { name: "برمجة 1", department: "IT", year: 1 },
      { name: "هياكل البيانات", department: "IT", year: 2 },
      { name: "مشروع التخرج", department: "IT", year: 4 },
    ],
  },
  {
    id: 2,
    name: "د. سارة محمد",
    email: "sara.mohamed@uni.edu",
    photo: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "01212345678",
    subjects: [
      { name: "رياضيات 1", department: "IT", year: 1 },
      { name: "قواعد البيانات", department: "IT", year: 2 },
      { name: "برمجة كائنية", department: "CS", year: 2 },
    ],
  },
  {
    id: 3,
    name: "د. عمر خالد",
    email: "omar.khaled@uni.edu",
    photo: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "01223456789",
    subjects: [
      { name: "مقدمة في الحاسب", department: "IT", year: 1 },
      { name: "أنظمة التشغيل", department: "IT", year: 3 },
      { name: "قواعد بيانات متقدمة", department: "CS", year: 2 },
      { name: "حوسبة سحابية", department: "CS", year: 4 },
    ],
  },
  {
    id: 4,
    name: "د. آية سمير",
    email: "aya.samir@uni.edu",
    photo: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "01234567890",
    subjects: [
      { name: "برمجة بـ Python", department: "CS", year: 1 },
      { name: "خوارزميات", department: "CS", year: 2 },
      { name: "هندسة البرمجيات", department: "CS", year: 3 },
      { name: "مشروع التخرج", department: "CS", year: 4 },
    ],
  },
  {
    id: 5,
    name: "د. نور إبراهيم",
    email: "nour.ibrahim@uni.edu",
    photo: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "01245678901",
    subjects: [
      { name: "ذكاء اصطناعي", department: "IT", year: 3 },
      { name: "إنترنت الأشياء", department: "IT", year: 4 },
      { name: "نظرية الأتمتة", department: "CS", year: 2 },
      { name: "تعلم عميق", department: "CS", year: 4 },
    ],
  },
];

export const universityAssistants: Assistant[] = [
  { id: 1, name: "Ahmed Hassan",     email: "ahmed.ta@uni.edu",    phone: "01301234567", photo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", department: "IT", year: 1, subjects: ["برمجة 1", "رياضيات 1"] },
  { id: 2, name: "Sara Mohamed",     email: "sara.ta@uni.edu",     phone: "01312345678", photo: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", department: "IT", year: 2, subjects: ["هياكل البيانات", "قواعد البيانات"] },
  { id: 3, name: "Omar Khaled",      email: "omar.ta@uni.edu",     phone: "01323456789", photo: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",  department: "IT", year: 3, subjects: ["أنظمة التشغيل", "ذكاء اصطناعي"] },
  { id: 4, name: "Mona Ali",         email: "mona.ta@uni.edu",     phone: "01334567890", photo: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",  department: "IT", year: 4, subjects: ["إنترنت الأشياء", "مشروع التخرج"] },
  { id: 5, name: "Youssef Adel",     email: "youssef.ta@uni.edu",  phone: "01345678901", photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", department: "CS", year: 1, subjects: ["برمجة بـ Python", "رياضيات منطقية"] },
  { id: 6, name: "Nour Ibrahim",     email: "nour.ta@uni.edu",     phone: "01356789012", photo: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",  department: "CS", year: 2, subjects: ["خوارزميات", "برمجة كائنية"] },
  { id: 7, name: "Hassan Mahmoud",   email: "hassan.ta@uni.edu",   phone: "01367890123", photo: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",  department: "CS", year: 3, subjects: ["هندسة البرمجيات", "الذكاء الاصطناعي"] },
  { id: 8, name: "Laila Mostafa TA", email: "laila.ta@uni.edu",    phone: "01378901234", photo: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", department: "CS", year: 4, subjects: ["مشروع التخرج", "تعلم عميق"] },
];

export const lectures: Lecture[] = [
  { id: 1,  subject: "برمجة 1",          teacherId: 1, department: "IT", year: 1, hall: "RA201", day: "Saturday",  startTime: "09:00", endTime: "10:30", mode: "offline" },
  { id: 2,  subject: "رياضيات 1",        teacherId: 2, department: "IT", year: 1, hall: "RB301", day: "Sunday",    startTime: "10:00", endTime: "11:30", mode: "offline" },
  { id: 3,  subject: "هياكل البيانات",    teacherId: 1, department: "IT", year: 2, hall: "RB305", day: "Tuesday",   startTime: "09:00", endTime: "10:30", mode: "offline" },
  { id: 4,  subject: "قواعد البيانات",    teacherId: 2, department: "IT", year: 2, hall: "W5",    day: "Wednesday", startTime: "12:00", endTime: "13:30", mode: "offline" },
  { id: 5,  subject: "أنظمة التشغيل",     teacherId: 3, department: "IT", year: 3, hall: "RA303", day: "Thursday",  startTime: "09:00", endTime: "10:30", mode: "offline" },
  { id: 6,  subject: "ذكاء اصطناعي",     teacherId: 5, department: "IT", year: 3, hall: "RB201", day: "Saturday",  startTime: "12:00", endTime: "13:30", mode: "offline" },
  { id: 7,  subject: "مشروع التخرج",     teacherId: 1, department: "IT", year: 4, hall: "W13",   day: "Thursday",  startTime: "13:00", endTime: "15:00", mode: "offline" },
  { id: 8,  subject: "إنترنت الأشياء",    teacherId: 5, department: "IT", year: 4, hall: "W6",    day: "Tuesday",   startTime: "10:00", endTime: "11:30", mode: "offline" },
  { id: 9,  subject: "برمجة بـ Python",   teacherId: 4, department: "CS", year: 1, hall: "H1B",   day: "Sunday",    startTime: "09:00", endTime: "10:30", mode: "offline" },
  { id: 10, subject: "خوارزميات",         teacherId: 4, department: "CS", year: 2, hall: "RA201", day: "Tuesday",   startTime: "12:00", endTime: "13:30", mode: "offline" },
  { id: 11, subject: "هندسة البرمجيات",   teacherId: 4, department: "CS", year: 3, hall: "RB301", day: "Wednesday", startTime: "09:00", endTime: "10:30", mode: "offline" },
  { id: 12, subject: "مشروع التخرج",     teacherId: 4, department: "CS", year: 4, hall: "W5",    day: "Saturday",  startTime: "10:00", endTime: "12:00", mode: "offline" },
  { id: 13, subject: "مقدمة في الحاسب",   teacherId: 3, department: "IT", year: 1, hall: "RB201", day: "Wednesday", startTime: "10:00", endTime: "11:30", mode: "offline" },
  { id: 14, subject: "قواعد بيانات متقدمة", teacherId: 3, department: "CS", year: 2, hall: "RA303", day: "Thursday",  startTime: "12:00", endTime: "13:30", mode: "offline" },
  { id: 15, subject: "برمجة كائنية",      teacherId: 2, department: "CS", year: 2, hall: "H1B",   day: "Saturday",  startTime: "12:00", endTime: "13:30", mode: "offline" },
  { id: 16, subject: "نظرية الأتمتة",     teacherId: 5, department: "CS", year: 2, hall: "RB305", day: "Wednesday", startTime: "14:00", endTime: "15:30", mode: "offline" },
  { id: 17, subject: "تعلم عميق",         teacherId: 5, department: "CS", year: 4, hall: "W6",    day: "Thursday",  startTime: "14:00", endTime: "15:30", mode: "offline" },
  { id: 18, subject: "حوسبة سحابية",      teacherId: 3, department: "CS", year: 4, hall: "RA201", day: "Saturday",  startTime: "14:00", endTime: "15:30", mode: "offline" },
];

export const universityExams: Exam[] = [
  {
    id: 1,
    title: "Midterm - برمجة 1",
    subject: "برمجة 1",
    teacherId: 1,
    department: "IT",
    year: 1,
    date: "2026-05-10",
    duration: 60,
    totalMarks: 30,
    questions: [
      { id: 1, type: "mcq", text: "What is a variable in programming?", options: ["A container for data", "A function", "A loop", "A class"], correctAnswer: "A container for data" },
      { id: 2, type: "mcq", text: "Which keyword is used for loops in C?", options: ["for", "loop", "repeat", "iterate"], correctAnswer: "for" },
      { id: 3, type: "true_false", text: "Arrays in C start at index 1.", correctAnswer: false },
      { id: 4, type: "true_false", text: "C is a compiled language.", correctAnswer: true },
      { id: 5, type: "essay", text: "Explain the difference between while and do-while loops." },
    ],
  },
  {
    id: 2,
    title: "Quiz 1 - هياكل البيانات",
    subject: "هياكل البيانات",
    teacherId: 1,
    department: "IT",
    year: 2,
    date: "2026-05-05",
    duration: 30,
    totalMarks: 20,
    questions: [
      { id: 1, type: "mcq", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)" },
      { id: 2, type: "true_false", text: "A stack follows FIFO principle.", correctAnswer: false },
      { id: 3, type: "essay", text: "Compare linked list and array in terms of memory and access time." },
    ],
  },
  {
    id: 3,
    title: "Midterm - برمجة بـ Python",
    subject: "برمجة بـ Python",
    teacherId: 4,
    department: "CS",
    year: 1,
    date: "2026-05-12",
    duration: 45,
    totalMarks: 25,
    questions: [
      { id: 1, type: "mcq", text: "Which of the following is immutable in Python?", options: ["List", "Dictionary", "Tuple", "Set"], correctAnswer: "Tuple" },
      { id: 2, type: "true_false", text: "Python is a statically typed language.", correctAnswer: false },
      { id: 3, type: "essay", text: "Write a function to reverse a string in Python." },
    ],
  },
  {
    id: 4,
    title: "Quiz - ذكاء اصطناعي",
    subject: "ذكاء اصطناعي",
    teacherId: 5,
    department: "IT",
    year: 3,
    date: "2026-05-08",
    duration: 40,
    totalMarks: 20,
    questions: [
      { id: 1, type: "mcq", text: "What is the goal of AI?", options: ["Simulate intelligence", "Build robots", "Store data", "Create websites"], correctAnswer: "Simulate intelligence" },
      { id: 2, type: "true_false", text: "Machine learning is a subset of AI.", correctAnswer: true },
    ],
  },
];

export const universityAssignments: Assignment[] = [
  { id: 1, title: "Lab 1 - Variables & I/O",     description: "Write a C program that reads two numbers and prints their sum, difference, and product.", subject: "برمجة 1",       teacherId: 1, department: "IT", year: 1, dueDate: "2026-05-15", hasPdf: true,  pdfName: "lab1_programming.pdf" },
  { id: 2, title: "Homework - Linked Lists",      description: "Implement a singly linked list with insert, delete, and search operations.",             subject: "هياكل البيانات", teacherId: 1, department: "IT", year: 2, dueDate: "2026-05-20", hasPdf: false },
  { id: 3, title: "Project - Web Application",    description: "Build a simple CRUD web application using HTML, CSS, and JavaScript.",                   subject: "تطوير الويب",    teacherId: 1, department: "IT", year: 2, dueDate: "2026-06-01", hasPdf: true,  pdfName: "web_project_spec.pdf" },
  { id: 4, title: "Python Assignment 1",          description: "Solve 10 problems on loops and functions in Python.",                                     subject: "برمجة بـ Python", teacherId: 4, department: "CS", year: 1, dueDate: "2026-05-18", hasPdf: true,  pdfName: "python_hw1.pdf" },
  { id: 5, title: "AI Research Summary",          description: "Write a 2-page summary on the current state of AI in healthcare.",                       subject: "ذكاء اصطناعي",   teacherId: 5, department: "IT", year: 3, dueDate: "2026-05-25", hasPdf: false },
];

export const assignmentSubmissions: AssignmentSubmission[] = [
  { id: 1, assignmentId: 1, studentId: 1,  studentName: "Ahmed Ali",      submittedAt: "2026-05-13T14:30:00", fileName: "ahmed_lab1.c" },
  { id: 2, assignmentId: 1, studentId: 2,  studentName: "Mohamed Hassan", submittedAt: "2026-05-14T09:15:00", fileName: "mohamed_lab1.c" },
  { id: 3, assignmentId: 4, studentId: 9,  studentName: "Mona Fathy",     submittedAt: "2026-05-17T16:00:00", fileName: "mona_python_hw1.py" },
  { id: 4, assignmentId: 4, studentId: 10, studentName: "Ali Mahmoud",    submittedAt: "2026-05-18T08:45:00", fileName: "ali_python_hw1.py" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 1,  lectureId: 1, studentId: 1,  date: "2026-04-26", status: "present" },
  { id: 2,  lectureId: 1, studentId: 2,  date: "2026-04-26", status: "absent"  },
  { id: 3,  lectureId: 3, studentId: 3,  date: "2026-04-22", status: "present" },
  { id: 4,  lectureId: 3, studentId: 4,  date: "2026-04-22", status: "present" },
  { id: 5,  lectureId: 5, studentId: 5,  date: "2026-04-24", status: "present" },
  { id: 6,  lectureId: 5, studentId: 6,  date: "2026-04-24", status: "absent"  },
  { id: 7,  lectureId: 9, studentId: 9,  date: "2026-04-27", status: "present" },
  { id: 8,  lectureId: 9, studentId: 10, date: "2026-04-27", status: "present" },
  { id: 9,  lectureId: 6, studentId: 5,  date: "2026-04-26", status: "present" },
  { id: 10, lectureId: 6, studentId: 6,  date: "2026-04-26", status: "present" },
];

export const examResults: ExamResult[] = [
  { id: 1,  examId: 1, studentId: 1,  studentName: "Ahmed Ali",       score: 25, totalMarks: 30 },
  { id: 2,  examId: 1, studentId: 2,  studentName: "Mohamed Hassan",  score: 20, totalMarks: 30 },
  { id: 3,  examId: 2, studentId: 3,  studentName: "Sara Mahmoud",    score: 18, totalMarks: 20 },
  { id: 4,  examId: 2, studentId: 4,  studentName: "Youssef Khaled",  score: 15, totalMarks: 20 },
  { id: 5,  examId: 3, studentId: 9,  studentName: "Mona Fathy",      score: 22, totalMarks: 25 },
  { id: 6,  examId: 3, studentId: 10, studentName: "Ali Mahmoud",     score: 19, totalMarks: 25 },
  { id: 7,  examId: 4, studentId: 5,  studentName: "Nour Samir",      score: 17, totalMarks: 20 },
  { id: 8,  examId: 4, studentId: 6,  studentName: "Omar Adel",       score: 14, totalMarks: 20 },
];

export const universityMessages: Message[] = [
  { id: 1, fromId: 1, fromName: "د. أحمد حسن",  fromRole: "teacher",    toId: 1, toName: "Ahmed Hassan", toRole: "assistant", content: "Please prepare the lab for tomorrow's session.", timestamp: "2026-04-26T10:00:00", read: true },
  { id: 2, fromId: 1, fromName: "Ahmed Hassan",  fromRole: "assistant",  toId: 1, toName: "د. أحمد حسن", toRole: "teacher",   content: "Lab is ready. I've set up all the machines.", timestamp: "2026-04-26T11:30:00", read: true },
  { id: 3, fromId: 1, fromName: "Ahmed Ali",     fromRole: "student",    toId: 1, toName: "د. أحمد حسن", toRole: "teacher",   content: "Doctor, I have a question about the assignment.", timestamp: "2026-04-27T09:00:00", read: false },
  { id: 4, fromId: 0, fromName: "Admin",         fromRole: "admin",      toId: 1, toName: "د. أحمد حسن", toRole: "teacher",   content: "Please submit your exam schedule for next month.", timestamp: "2026-04-27T08:00:00", read: false },
  { id: 5, fromId: 4, fromName: "د. آية سمير",   fromRole: "teacher",    toId: 9, toName: "Mona Fathy",  toRole: "student",   content: "Great job on your last assignment!", timestamp: "2026-04-26T15:00:00", read: true },
];

export const universityAnnouncements: Announcement[] = [
  { id: 1, title: "Midterm Exam Schedule",         content: "Midterm exams will start from May 10th. Please check the schedule on the portal.", fromId: 0, fromName: "Admin",       fromRole: "admin",   targetDepartment: "all",  date: "2026-04-25" },
  { id: 2, title: "Lab Equipment Maintenance",     content: "Labs will be closed on Friday for maintenance. Plan accordingly.",                fromId: 0, fromName: "Admin",       fromRole: "admin",   targetDepartment: "IT",   date: "2026-04-24" },
  { id: 3, title: "Assignment Deadline Extension",  content: "The deadline for Programming 1 lab assignment has been extended by 3 days.",      fromId: 1, fromName: "د. أحمد حسن", fromRole: "teacher", targetDepartment: "IT", targetYear: 1, date: "2026-04-26" },
  { id: 4, title: "New Python Resources Available", content: "Check the shared folder for new Python learning resources and practice problems.", fromId: 4, fromName: "د. آية سمير", fromRole: "teacher", targetDepartment: "CS", targetYear: 1, date: "2026-04-25" },
  { id: 5, title: "Graduation Ceremony Date",       content: "The graduation ceremony for 4th year students will be held on June 30th.",        fromId: 0, fromName: "Admin",       fromRole: "admin",   targetDepartment: "all",  date: "2026-04-20" },
];

export const universityEvents: UniEvent[] = [
  { id: 1, title: "National Holiday - Liberation Day",  description: "University is closed for Liberation Day.",                              date: "2026-04-25", type: "holiday",     targetAudience: "all" },
  { id: 2, title: "Programming Competition",            description: "Annual ACM-style programming competition. Register at the CS department.", date: "2026-05-15", type: "competition", targetAudience: "students" },
  { id: 3, title: "AI Seminar by Google",               description: "A seminar on practical AI applications hosted by Google engineers.",     date: "2026-05-20", type: "seminar",     targetAudience: "all" },
  { id: 4, title: "Sports Day",                         description: "University-wide sports tournament. All departments participate.",        date: "2026-05-25", type: "general",     targetAudience: "all" },
  { id: 5, title: "Career Fair",                        description: "Meet top employers and explore internship/job opportunities.",            date: "2026-06-01", type: "general",     targetAudience: "students" },
];

// ── Helper Functions ───────────────────────────────────────

export function getTeacherStudents(teacherId: number): UniversityStudent[] {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  const teacherYearDepts = teacher.subjects.map((s) => `${s.department}-${s.year}`);
  const unique = [...new Set(teacherYearDepts)];
  return universityStudents.filter((s) =>
    unique.includes(`${s.department}-${s.year}`)
  );
}

export function getTeacherLectures(teacherId: number): Lecture[] {
  return lectures.filter((l) => l.teacherId === teacherId);
}

export function getTeacherAssistants(teacherId: number): Assistant[] {
  const teacher = universityTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  const subjectNames = teacher.subjects.map((s) => s.name);
  return universityAssistants.filter((a) =>
    a.subjects.some((s) => subjectNames.includes(s))
  );
}

export function getTeacherExams(teacherId: number): Exam[] {
  return universityExams.filter((e) => e.teacherId === teacherId);
}

export function getTeacherAssignments(teacherId: number): Assignment[] {
  return universityAssignments.filter((a) => a.teacherId === teacherId);
}

export function getStudentExams(studentId: number): Exam[] {
  const student = universityStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return universityExams.filter(
    (e) => e.department === student.department && e.year === student.year
  );
}

export function getStudentAssignments(studentId: number): Assignment[] {
  const student = universityStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return universityAssignments.filter(
    (a) => a.department === student.department && a.year === student.year
  );
}

export function getStudentResults(studentId: number): ExamResult[] {
  return examResults.filter((r) => r.studentId === studentId);
}

export function getStudentAttendance(studentId: number): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.studentId === studentId);
}

export function getLectureStudents(lectureId: number): UniversityStudent[] {
  const lecture = lectures.find((l) => l.id === lectureId);
  if (!lecture) return [];
  return universityStudents.filter(
    (s) => s.department === lecture.department && s.year === lecture.year
  );
}

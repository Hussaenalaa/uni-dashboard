"use client";

import { useState } from "react";
import { departmentsData, Department, Subject } from "@/lib/data";
import SubjectForm from "@/components/forms/SubjectForm";
import { useAuth } from "@/context/AuthContext";

const typeColors: Record<Subject["type"], string> = {
  "نظري": "bg-blue-100 text-blue-700",
  "عملي": "bg-green-100 text-green-700",
  "نظري وعملي": "bg-purple-100 text-purple-700",
};

const yearLabels: Record<number, string> = {
  1: "السنة الأولى",
  2: "السنة الثانية",
  3: "السنة الثالثة",
  4: "السنة الرابعة",
};

export default function SubjectListPage() {
  const { user } = useAuth();
  const role = user?.role ?? "STUDENT";
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [activeDept, setActiveDept] = useState(departmentsData[0].id);
  const [activeYear, setActiveYear] = useState<1 | 2 | 3 | 4>(1);
  const [modal, setModal] = useState<{
    open: boolean;
    type: "create" | "update" | "delete";
    subject?: Subject;
  }>({ open: false, type: "create" });
  const [searchQuery, setSearchQuery] = useState("");

  const currentDept = departments.find((d) => d.id === activeDept)!;
  const currentYearData = currentDept.years.find((y) => y.year === activeYear)!;
  const filteredSubjects = currentYearData.subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHours = currentYearData.subjects.reduce((acc, s) => acc + s.hours, 0);

  const handleSave = (subject: Subject) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id !== activeDept) return dept;
        return {
          ...dept,
          years: dept.years.map((yr) => {
            if (yr.year !== activeYear) return yr;
            const exists = yr.subjects.find((s) => s.id === subject.id);
            return {
              ...yr,
              subjects: exists
                ? yr.subjects.map((s) => (s.id === subject.id ? subject : s))
                : [...yr.subjects, subject],
            };
          }),
        };
      })
    );
    setModal({ open: false, type: "create" });
  };

  const handleDelete = (id: number) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id !== activeDept) return dept;
        return {
          ...dept,
          years: dept.years.map((yr) => {
            if (yr.year !== activeYear) return yr;
            return { ...yr, subjects: yr.subjects.filter((s) => s.id !== id) };
          }),
        };
      })
    );
    setModal({ open: false, type: "create" });
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">المواد الدراسية</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مادة..."
            className="border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky w-48"
          />
          {role === "ADMIN" && (
            <button
              onClick={() => setModal({ open: true, type: "create" })}
              className="flex items-center gap-1 bg-lamaYellow text-gray-800 text-sm px-3 py-1.5 rounded-full font-medium hover:bg-yellow-300 transition"
            >
              <span className="text-lg leading-none">+</span> إضافة مادة
            </button>
          )}
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => { setActiveDept(dept.id); setActiveYear(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all ${
              activeDept === dept.id
                ? "bg-lamaPurple text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Year Tabs */}
      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4].map((yr) => (
          <button
            key={yr}
            onClick={() => setActiveYear(yr as 1 | 2 | 3 | 4)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-all border ${
              activeYear === yr
                ? "bg-lamaSky text-white border-lamaSky"
                : "text-gray-500 border-gray-300 hover:border-lamaSky hover:text-lamaSky"
            }`}
          >
            {yearLabels[yr]}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 mb-4 text-sm text-gray-500">
        <span>
          📚 عدد المواد:{" "}
          <strong className="text-gray-700">{currentYearData.subjects.length}</strong>
        </span>
        <span>
          ⏱ إجمالي الساعات:{" "}
          <strong className="text-gray-700">{totalHours} ساعة</strong>
        </span>
        <span>
          🏛 القسم:{" "}
          <strong className="text-gray-700">{currentDept.name}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-semibold">
              <th className="text-right p-3 border-b">#</th>
              <th className="text-right p-3 border-b">اسم المادة</th>
              <th className="text-right p-3 border-b">الكود</th>
              <th className="text-right p-3 border-b hidden md:table-cell">الأساتذة</th>
              <th className="text-right p-3 border-b hidden md:table-cell">الساعات</th>
              <th className="text-right p-3 border-b">النوع</th>
              {role === "ADMIN" && (
                <th className="text-right p-3 border-b">الإجراءات</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "ADMIN" ? 7 : 6}
                  className="text-center py-10 text-gray-400"
                >
                  لا توجد مواد مطابقة
                </td>
              </tr>
            ) : (
              filteredSubjects.map((subject, index) => (
                <tr
                  key={subject.id}
                  className="border-b border-gray-100 hover:bg-lamaPurpleLight transition-colors even:bg-slate-50"
                >
                  <td className="p-3 text-gray-400 font-mono">{index + 1}</td>
                  <td className="p-3 font-medium text-gray-800">{subject.name}</td>
                  <td className="p-3 font-mono text-gray-500 text-xs">
                    {subject.code}
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-600 text-xs">
                    {subject.teachers.join(" / ")}
                  </td>
                  <td className="p-3 hidden md:table-cell text-center">
                    <span className="bg-lamaYellow text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">
                      {subject.hours}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[subject.type]}`}
                    >
                      {subject.type}
                    </span>
                  </td>
                  {role === "ADMIN" && (
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setModal({ open: true, type: "update", subject })
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky hover:bg-blue-300 transition text-white text-xs"
                          title="تعديل"
                        >
                          ✏
                        </button>
                        <button
                          onClick={() =>
                            setModal({ open: true, type: "delete", subject })
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple hover:bg-purple-400 transition text-white text-xs"
                          title="حذف"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl relative w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModal({ open: false, type: "create" })}
              className="absolute top-3 left-3 text-gray-400 hover:text-gray-700 text-xl font-bold z-10"
            >
              ✕
            </button>

            {modal.type === "delete" && modal.subject ? (
              <div className="p-6 flex flex-col gap-4 text-center" dir="rtl">
                <div className="text-4xl">🗑️</div>
                <h2 className="text-lg font-bold text-gray-800">تأكيد الحذف</h2>
                <p className="text-gray-600 text-sm">
                  هل أنت متأكد من حذف مادة{" "}
                  <strong>{modal.subject.name}</strong>؟ لن يمكن التراجع عن هذا
                  الإجراء.
                </p>
                <div className="flex gap-3 justify-center mt-2">
                  <button
                    onClick={() => setModal({ open: false, type: "create" })}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleDelete(modal.subject!.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    حذف نهائياً
                  </button>
                </div>
              </div>
            ) : (
              <SubjectForm
                type={modal.type as "create" | "update"}
                data={modal.subject}
                onSave={handleSave}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

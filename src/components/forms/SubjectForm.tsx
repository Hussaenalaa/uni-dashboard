"use client";

import { useState } from "react";
import { Subject } from "@/lib/data";

type SubjectFormProps = {
  type: "create" | "update";
  data?: Subject;
  onSave?: (subject: Subject) => void;
};

const SubjectForm = ({ type, data, onSave }: SubjectFormProps) => {
  const [formData, setFormData] = useState<Partial<Subject>>({
    id: data?.id ?? Date.now(),
    name: data?.name ?? "",
    code: data?.code ?? "",
    teachers: data?.teachers ?? [""],
    hours: data?.hours ?? 2,
    type: data?.type ?? "نظري",
  });

  const handleTeacherChange = (index: number, value: string) => {
    const updated = [...(formData.teachers ?? [])];
    updated[index] = value;
    setFormData({ ...formData, teachers: updated });
  };

  const addTeacher = () => {
    setFormData({ ...formData, teachers: [...(formData.teachers ?? []), ""] });
  };

  const removeTeacher = (index: number) => {
    const updated = (formData.teachers ?? []).filter((_, i) => i !== index);
    setFormData({ ...formData, teachers: updated });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return;
    const cleanTeachers = (formData.teachers ?? []).filter((t) => t.trim() !== "");
    const subject: Subject = {
      id: formData.id!,
      name: formData.name,
      code: formData.code,
      teachers: cleanTeachers,
      hours: formData.hours ?? 2,
      type: formData.type ?? "نظري",
    };
    onSave?.(subject);
  };

  return (
    <div className="p-4 flex flex-col gap-4" dir="rtl">
      <h2 className="text-center text-lg font-bold text-gray-700">
        {type === "create" ? "إضافة مادة جديدة" : "تعديل المادة"}
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">اسم المادة</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky"
          placeholder="مثال: هياكل البيانات"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">كود المادة</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky"
          placeholder="مثال: IT201"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">الساعات</label>
          <input
            type="number"
            min={1}
            max={9}
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">النوع</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Subject["type"] })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky"
          >
            <option value="نظري">نظري</option>
            <option value="عملي">عملي</option>
            <option value="نظري وعملي">نظري وعملي</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600">الأساتذة</label>
          <button
            type="button"
            onClick={addTeacher}
            className="text-xs bg-lamaSky text-white px-2 py-1 rounded-md hover:bg-blue-400 transition"
          >
            + إضافة أستاذ
          </button>
        </div>
        {(formData.teachers ?? []).map((teacher, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={teacher}
              onChange={(e) => handleTeacherChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lamaSky"
              placeholder="اسم الأستاذ"
            />
            {(formData.teachers?.length ?? 0) > 1 && (
              <button
                type="button"
                onClick={() => removeTeacher(index)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-lamaPurple text-white py-2 px-4 rounded-md w-full font-medium hover:bg-purple-500 transition mt-2"
      >
        {type === "create" ? "إضافة المادة" : "حفظ التعديلات"}
      </button>
    </div>
  );
};

export default SubjectForm;

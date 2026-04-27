// NOTE: This component is legacy. The active sidebar is src/components/layout/Sidebar.tsx
// Kept for backward compatibility. It now reads role from AuthContext.
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/role";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
      { icon: "/teacher.png", label: "Teachers", href: "/DashBoard/list/teachers", visible: ["ADMIN"] },
      { icon: "/student.png", label: "Students", href: "/DashBoard/list/students", visible: ["ADMIN", "TEACHER"] },
      { icon: "/parent.png", label: "Assistants", href: "/DashBoard/list/parents", visible: ["ADMIN", "TEACHER"] },
      { icon: "/subject.png", label: "Subjects", href: "/DashBoard/list/subjects", visible: ["ADMIN"] },
      { icon: "/class.png", label: "Classes", href: "/DashBoard/list/classes", visible: ["ADMIN", "TEACHER"] },
      { icon: "/lesson.png", label: "Lessons", href: "/DashBoard/list/lessons", visible: ["ADMIN", "TEACHER"] },
      { icon: "/exam.png", label: "Exams", href: "/DashBoard/list/exams", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
      { icon: "/assignment.png", label: "Assignments", href: "/DashBoard/list/assignments", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
      { icon: "/result.png", label: "Results", href: "/DashBoard/list/results", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
      { icon: "/attendance.png", label: "Attendance", href: "/DashBoard/list/attendance", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
      { icon: "/calendar.png", label: "Events", href: "/DashBoard/list/events", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
      { icon: "/message.png", label: "Messages", href: "/DashBoard/list/messages", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
      { icon: "/announcement.png", label: "Announcements", href: "/DashBoard/list/announcements", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/DashBoard/profile", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
      { icon: "/setting.png", label: "Settings", href: "/DashBoard/settings", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"] },
    ],
  },
];

const Menu = () => {
  const { user } = useAuth();
  const role = (user?.role ?? "") as Role;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((group) => (
        <div className="flex flex-col gap-2" key={group.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{group.title}</span>
          {group.items.map((item) => {
            if (!item.visible.includes(role)) return null;
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

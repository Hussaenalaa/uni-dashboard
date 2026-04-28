"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/role";

type MenuItem = { label: string; href: string | "PROFILE"; icon: string; visible: Role[] };
type MenuGroup = { title: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  {
    title: "MAIN",
    items: [
      { icon: "/home.png",         label: "Dashboard",      href: "PROFILE",                          visible: ["ADMIN","TEACHER","STUDENT","PARENT","STAFF"] },
      { icon: "/teacher.png",      label: "Teachers",       href: "/DashBoard/list/teachers",         visible: ["ADMIN"] },
      { icon: "/student.png",      label: "Students",       href: "/DashBoard/list/students",         visible: ["ADMIN","TEACHER"] },
      { icon: "/parent.png",       label: "Assistants",     href: "/DashBoard/list/parents",          visible: ["ADMIN","TEACHER"] },
    ],
  },
  {
    title: "ACADEMIC",
    items: [
      { icon: "/subject.png",      label: "Subjects",       href: "/DashBoard/list/subjects",         visible: ["ADMIN"] },
      { icon: "/class.png",        label: "Classes",        href: "/DashBoard/list/classes",          visible: ["ADMIN","TEACHER"] },
      { icon: "/lesson.png",       label: "Lessons",        href: "/DashBoard/list/lessons",          visible: ["ADMIN","TEACHER"] },
    ],
  },
  {
    title: "ASSESSMENTS",
    items: [
      { icon: "/exam.png",         label: "Exams",          href: "/DashBoard/list/exams",            visible: ["ADMIN"] },
      { icon: "/assignment.png",   label: "Assignments",    href: "/DashBoard/list/assignments",      visible: ["ADMIN"] },
      { icon: "/result.png",       label: "Results",        href: "/DashBoard/list/results",          visible: ["ADMIN"] },
      { icon: "/attendance.png",   label: "Attendance",     href: "/DashBoard/list/attendance",       visible: ["ADMIN"] },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { icon: "/calendar.png",     label: "Events",         href: "/DashBoard/list/events",           visible: ["ADMIN","TEACHER","STUDENT","PARENT","STAFF"] },
      { icon: "/message.png",      label: "Messages",       href: "/DashBoard/list/messages",         visible: ["ADMIN","TEACHER","STUDENT","PARENT"] },
      { icon: "/announcement.png", label: "Announcements",  href: "/DashBoard/list/announcements",    visible: ["ADMIN","TEACHER","STUDENT","PARENT","STAFF"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/setting.png",      label: "Settings",       href: "/DashBoard/settings",              visible: ["ADMIN","TEACHER","STUDENT","PARENT","STAFF"] },
    ],
  },
];

const roleDashboardMap: Record<Role, (profileId?: number) => string> = {
  ADMIN:   () => "/DashBoard/admin",
  TEACHER: (id) => `/DashBoard/list/teachers/${id ?? 1}`,
  STUDENT: (id) => `/DashBoard/list/students/${id ?? 101}`,
  PARENT:  () => "/DashBoard/parent",
  STAFF:   () => "/DashBoard/staff",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator", TEACHER: "Teacher",
  STUDENT: "Student", PARENT: "Parent / Guardian", STAFF: "Staff",
};

const roleBadgeColors: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-700", TEACHER: "bg-blue-100 text-blue-700",
  STUDENT: "bg-green-100 text-green-700", PARENT: "bg-purple-100 text-purple-700",
  STAFF: "bg-yellow-100 text-yellow-700",
};

export default function Sidebar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <aside className="w-16 lg:w-64 bg-white border-r flex flex-col items-center py-6 gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden lg:flex flex-col gap-2 w-3/4">
          {[...Array(6)].map((_,i) => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />)}
        </div>
      </aside>
    );
  }

  if (!user) {
    return <aside className="w-16 lg:w-64 bg-white border-r p-4"><p className="text-gray-400 text-sm hidden lg:block">Please log in</p></aside>;
  }

  const role = user.role as Role;
  const profileHref = roleDashboardMap[role](user.profileId);

  return (
    <aside className="w-16 lg:w-64 bg-white border-r flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <Image src="/logo.png" alt="University Logo" width={36} height={36} className="rounded-md flex-shrink-0" />
        <div className="hidden lg:block">
          <p className="font-bold text-sm leading-tight text-gray-800">University</p>
          <p className="text-xs text-gray-400">Management System</p>
        </div>
      </div>

      {/* User Info */}
      <div className="hidden lg:flex flex-col gap-1 px-4 py-3 border-b bg-gray-50">
        <p className="text-sm font-semibold text-gray-800 capitalize">{user.username}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${roleBadgeColors[role]}`}>
          {roleLabels[role]}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {menuGroups.map(group => {
          const visibleItems = group.items.filter(item => item.visible.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.title} className="mb-4">
              <p className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">{group.title}</p>
              <div className="flex flex-col gap-0.5">
                {visibleItems.map(item => {
                  const href = item.href === "PROFILE" ? profileHref : item.href;
                  const isActive = pathname === href || (item.href === "PROFILE" && pathname.startsWith(profileHref));
                  return (
                    <Link key={item.label} href={href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm ${
                        isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                      <Image src={item.icon} alt={item.label} width={18} height={18} className="flex-shrink-0 opacity-70" />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t">
        <button onClick={() => { logout(); window.location.href = "/login"; }}
          className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
          <Image src="/logout.png" alt="Logout" width={18} height={18} className="flex-shrink-0 opacity-70" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}

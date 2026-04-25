import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const STATS = [
  { label: "Attendance", value: "90%", icon: "/singleAttendance.png" },
  { label: "Branches",   value: "2",   icon: "/singleBranch.png"    },
  { label: "Lessons",    value: "6",   icon: "/singleLesson.png"    },
  { label: "Classes",    value: "6",   icon: "/singleClass.png"     },
];

const SHORTCUTS = [
  { label: "Classes",     href: "/", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" },
  { label: "Teachers",    href: "/", color: "bg-sky-100    text-sky-800    hover:bg-sky-200"       },
  { label: "Lessons",     href: "/", color: "bg-violet-100 text-violet-800 hover:bg-violet-200"   },
  { label: "Exams",       href: "/", color: "bg-amber-100  text-amber-800  hover:bg-amber-200"    },
  { label: "Assignments", href: "/", color: "bg-rose-100   text-rose-800   hover:bg-rose-200"     },
];

const SingleStudentPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ── page header ── */}
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Student profile
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800 tracking-tight">
          Student Overview
        </h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="flex flex-col gap-6">

          {/* Profile card */}
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            {/* banner – blue for student, green for teacher */}
            <div className="h-24 bg-gradient-to-br from-sky-400 to-indigo-500" />

            {/* avatar */}
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4">
                <Image
                  src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
                  alt="Student"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl object-cover ring-4 ring-white shadow"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-800">Jeffrey Example</h2>
              <p className="text-sm text-sky-600 font-medium mt-0.5">Grade 10 · Section B</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Active student with consistently strong academic performance across all subjects.
              </p>

              {/* contact details */}
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  { icon: "/mail.png",  text: "jeffrey@school.edu" },
                  { icon: "/phone.png", text: "+1 234 567 890"      },
                  { icon: "/date.png",  text: "Enrolled Jan 2025"   },
                  { icon: "/blood.png", text: "Blood group: A+"     },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-slate-600">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Image src={icon} alt="" width={14} height={14} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ label, value, icon }) => (
              <div
                key={label}
                className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                  <Image src={icon} alt={label} width={16} height={16} />
                </span>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Shortcuts */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Quick Links
            </h3>
            <div className="flex flex-wrap gap-2">
              {SHORTCUTS.map(({ label, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${color}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Performance widget */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Performance
            </h3>
            <Performance />
          </div>

        </aside>

        {/* ════ RIGHT MAIN AREA ════ */}
        <main className="flex flex-col gap-6">

          {/* Schedule */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Weekly view
                </p>
                <h2 className="text-xl font-bold text-slate-800 mt-0.5">Class Schedule</h2>
              </div>
              <span className="rounded-full bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1">
                Enrolled
              </span>
            </div>
            <BigCalendar />
          </div>

          {/* Announcements */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Announcements
            </h2>
            <Announcements />
          </div>

        </main>
      </div>
    </div>
  );
};

export default SingleStudentPage;
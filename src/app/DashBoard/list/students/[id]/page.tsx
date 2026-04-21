import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">

      {/* LEFT */}
      <div className="w-full xl:w-2/3">

        <div className="flex flex-col lg:flex-row gap-4">

          {/* STUDENT CARD */}
          <div className="bg-lamablue py-6 px-4 rounded-md flex-1 flex gap-4">

            {/* IMAGE */}
            <div className="w-1/3 flex items-center justify-center">
              <Image
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
                alt="Student"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="w-2/3 flex flex-col justify-between gap-4">

              <div>
                <h1 className="text-xl font-semibold">
                  Jeffrey Example
                </h1>
                <p className="text-sm text-gray-500">
                  Active student with strong academic performance.
                </p>
              </div>

              {/* DETAILS */}
              <div className="flex flex-wrap gap-4 text-xs font-medium">

                <div className="flex items-center gap-2">
                  <Image src="/blood.png" alt="blood" width={14} height={14} />
                  <span>A+</span>
                </div>

                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>January 2025</span>
                </div>

                <div className="flex items-center gap-2">
                  <Image src="/mail.png" alt="email" width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>

                <div className="flex items-center gap-2">
                  <Image src="/phone.png" alt="phone" width={14} height={14} />
                  <span>+1 234 567</span>
                </div>

              </div>

            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 flex-wrap">

            {/* ATTENDANCE */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt="attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>

            {/* BRANCHES */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt="branches"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>

            {/* LESSONS */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt="lessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            {/* CLASSES */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
              <Image
                src="/singleClass.png"
                alt="classes"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student Schedule</h1>
          <BigCalendar />
        </div>

      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">

        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>

          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">

            <Link className="p-3 rounded-md bg-lamaGreen" href="/">
              Student Classes
            </Link>

            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student Teachers
            </Link>

            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Student Lessons
            </Link>

            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Student Exams
            </Link>

            <Link className="p-3 rounded-md bg-lamablue" href="/">
              Student Assignments
            </Link>

          </div>
        </div>

        <Performance />
        <Announcements />

      </div>

    </div>
  );
};

export default SingleStudentPage;
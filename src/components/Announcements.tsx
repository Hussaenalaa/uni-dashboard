const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Midterm Exams Schedule Released</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-2 py-1">
              2026-03-15
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            The midterm exams timetable has been published. Students can check
            their exam dates through the student portal.
          </p>
        </div>

        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">New Assignment Deadline</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-2 py-1">
              2026-03-18
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            The deadline for the Database Systems assignment has been extended
            to next Sunday. Please submit your work on time.
          </p>
        </div>

        <div className="bg-lamaGreen rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">School Event: Science Fair</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-2 py-1">
              2026-03-22
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            The annual science fair will be held in the main hall. All students
            are invited to participate and showcase their projects.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Announcements;
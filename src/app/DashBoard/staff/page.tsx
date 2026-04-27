import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";

const StaffPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <h2 className="text-xl font-semibold text-gray-700">Staff Dashboard</h2>
        <p className="text-gray-500">Welcome! Access events and announcements from the sidebar.</p>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StaffPage;

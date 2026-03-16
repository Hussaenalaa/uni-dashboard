"use client";

import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMP DATA
const events = [
  {
    id: 1,
    title: "Database Lecture",
    time: "10:00 AM - 12:00 PM",
    description: "Lecture for third-year students about Database Design in Hall A.",
  },
  {
    id: 2,
    title: "Midterm Exam - Networking",
    time: "01:00 PM - 03:00 PM",
    description: "Midterm exam for second-year students in the Networking course.",
  },
  {
    id: 3,
    title: "AI Workshop",
    time: "11:00 AM - 02:00 PM",
    description: "Workshop about Artificial Intelligence and Machine Learning in Lab 3.",
  },

];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      
      {/* Calendar */}
      <Calendar onChange={onChange} value={value} />

      {/* Title */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold my-2">Events</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      {/* Events */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaGreen"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EventCalendar;
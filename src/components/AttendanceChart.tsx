"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Sat", firstYear: 60, secondYear: 55, thirdYear: 50, fourthYear: 45 },
  { day: "Sun", firstYear: 65, secondYear: 60, thirdYear: 55, fourthYear: 50 },
  { day: "Mon", firstYear: 70, secondYear: 65, thirdYear: 60, fourthYear: 55 },
  { day: "Tue", firstYear: 75, secondYear: 70, thirdYear: 65, fourthYear: 60 },
  { day: "Wed", firstYear: 80, secondYear: 75, thirdYear: 70, fourthYear: 65 },
  { day: "Thu", firstYear: 85, secondYear: 80, thirdYear: 75, fourthYear: 70 },
];

const colors = {
  firstYear: "#C3EBFA",
  secondYear: "#CEFFCF",
  thirdYear: "#CFCEFF",
  fourthYear: "#FAE27C",
};

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full flex flex-col">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tick={{ fill: "#6B7280" }}
              tickLine={false}
            />
            <YAxis axisLine={false} tick={{ fill: "#6B7280" }} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Bar  dataKey="firstYear" fill={colors.firstYear} radius={[10, 10, 0, 0]} />
            <Bar dataKey="secondYear" fill={colors.secondYear} radius={[10, 10, 0, 0]} />
            <Bar dataKey="thirdYear" fill={colors.thirdYear} radius={[10, 10, 0, 0]} />
            <Bar dataKey="fourthYear" fill={colors.fourthYear} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* CUSTOM LEGEND داخل الصندوق الأبيض */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-6 bg-white p-2 rounded shadow">
          {Object.keys(colors).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[key as keyof typeof colors] }}
              />
              <span className="text-sm font-medium text-xs text-gray-300">
                {key === "firstYear"
                  ? "First Year"
                  : key === "secondYear"
                  ? "Second Year"
                  : key === "thirdYear"
                  ? "Third Year"
                  : "Fourth Year"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "First Year",  count: 120, fill: "#C3EBFA" },
  { name: "Second Year", count: 95,  fill: "#CEFFCF" },
  { name: "Third Year",  count: 80,  fill: "#CFCEFF" },
  { name: "Fourth Year", count: 70,  fill: "#FAE27C" },
];

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students by Year</h1>
        <img src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <img
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 50, height: 50 }}
        />
      </div>

      <div className="flex justify-center gap-12">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col gap-1 items-center">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <h1 className="font-bold">{item.count}</h1>
            <h2 className="text-xs text-gray-300">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountChart;

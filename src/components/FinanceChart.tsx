"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const colors = ["#CEFFCF", "#ff6666", "#CEFFCF", "#C3EBFA"];

const data = [
  { name: "Paid", value: 700 },
  { name: "Unpaid", value: 300 },
];

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}
  C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height}
  ${x + width}, ${y + height} Z`;
};

const TriangleBar = (props: any) => {
  const { x, y, width, height, index } = props;
  const color = colors[index % colors.length];

  return (
    <path
      d={getPath(x, y, width, height)}
      stroke="none"
      fill={color}
    />
  );
};

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" shape={<TriangleBar />}>
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
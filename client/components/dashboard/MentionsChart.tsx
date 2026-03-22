import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SlidersHorizontal } from "lucide-react";

const weekData = [
  { day: "MON", mentions: 3200 },
  { day: "TUE", mentions: 4100 },
  { day: "WED", mentions: 5800 },
  { day: "THU", mentions: 7200 },
  { day: "FRI", mentions: 9400 },
  { day: "SAT", mentions: 13800 },
  { day: "SUN", mentions: 14208 },
];

const twoWeekData = [
  { day: "MON", mentions: 1800 },
  { day: "TUE", mentions: 2200 },
  { day: "WED", mentions: 3400 },
  { day: "THU", mentions: 4100 },
  { day: "FRI", mentions: 5600 },
  { day: "SAT", mentions: 7200 },
  { day: "SUN", mentions: 8900 },
  { day: "MON", mentions: 9400 },
  { day: "TUE", mentions: 10200 },
  { day: "WED", mentions: 11600 },
  { day: "THU", mentions: 12400 },
  { day: "FRI", mentions: 12900 },
  { day: "SAT", mentions: 13800 },
  { day: "SUN", mentions: 14208 },
];

const monthData = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  mentions: Math.floor(800 + (i / 29) * 13400 + Math.sin(i * 0.5) * 1200),
}));

const periodData: Record<string, typeof weekData> = {
  "7d": weekData,
  "14d": twoWeekData,
  "30d": monthData,
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
}

function CustomDot({ cx, cy, index, dataLength }: CustomDotProps) {
  if (index !== (dataLength ?? 0) - 1) return null;
  return (
    <circle cx={cx} cy={cy} r={5} fill="#3B82F6" stroke="white" strokeWidth={2} />
  );
}

export default function MentionsChart() {
  const [period, setPeriod] = useState("7d");
  const data = periodData[period];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900 text-[15px]">Mentions Over Time</h2>
        <div className="flex items-center gap-2">
          {["7d", "14d", "30d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 ml-1">
            <span>Filters</span>
            <SlidersHorizontal size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#9CA3AF", marginBottom: "2px" }}
              formatter={(val: number) => [val.toLocaleString(), "Mentions"]}
              cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="mentions"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#mentionsGradient)"
              dot={(props) => (
                <CustomDot
                  key={props.index}
                  cx={props.cx}
                  cy={props.cy}
                  index={props.index}
                  dataLength={data.length}
                />
              )}
              activeDot={{ r: 5, fill: "#3B82F6", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

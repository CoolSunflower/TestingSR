import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SlidersHorizontal } from "lucide-react";

// Toggle between 'bar' and 'area' to switch chart types
const CHART_TYPE: "bar" | "area" = "bar";

const formatNumber = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toString();
};

function generateSocialData(days = 7) {
  const data = [];

  for (let i = 0; i < days; i++) {
    // Base trend (slow growth, but not boring linear)
    const trend = 800 + (i / (days - 1)) * 12000;

    // Weekly cycle (weekend spikes)
    const weeklyCycle = Math.sin((i % 7) * (Math.PI / 3.5)) * 2500;

    // Random noise (because reality isn’t Excel)
    const noise = (Math.random() - 0.5) * 1500;

    // Occasional spikes (viral moments, chaos, bad decisions)
    const spike = Math.random() > 0.9 ? Math.random() * 4000 : 0;

    // Plateau effect (flatten some regions)
    const plateau =
      i % 6 === 2 || i % 6 === 3
        ? -Math.abs(Math.sin(i) * 1000)
        : 0;

    const mentions = Math.max(
      500,
      Math.floor(trend + weeklyCycle + noise + spike + plateau)
    );

    // Sentiment distribution (not perfectly proportional)
    const positiveRatio = 0.55 + Math.sin(i * 0.3) * 0.1;
    const neutralRatio = 0.30 + Math.cos(i * 0.2) * 0.05;
    const negativeRatio = 1 - positiveRatio - neutralRatio;

    const positive = Math.floor(mentions * positiveRatio);
    const neutral = Math.floor(mentions * neutralRatio);
    const negative = mentions - positive - neutral;

    data.push({
      day: days <= 14
        ? ["MON","TUE","WED","THU","FRI","SAT","SUN"][i % 7]
        : `D${i + 1}`,
      mentions,
      positive,
      neutral,
      negative,
    });
  }

  return data;
}

const weekData = generateSocialData(7);
const twoWeekData = generateSocialData(14);
const monthData = generateSocialData(30);

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
  color?: string;
}

function CustomDot({ cx, cy, index, dataLength, color }: CustomDotProps) {
  if (index !== (dataLength ?? 0) - 1) return null;
  return (
    <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />
  );
}

export default function MentionsChart() {
  const [period, setPeriod] = useState("7d");
  const data = periodData[period];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 text-[17px]">Mentions Over Time</h2>
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

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#10B981]"></div>
          <span className="text-xs font-medium text-gray-600">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#F59E0B]"></div>
          <span className="text-xs font-medium text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
          <span className="text-xs font-medium text-gray-600">Negative</span>
        </div>
      </div>

      <div className="flex-1 min-h-[260px] lg:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {CHART_TYPE === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 8, right: 6, left: -20, bottom: 6 }}
              barCategoryGap="10%"
              barGap={0}
            >
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "IBM Plex Sans" }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "IBM Plex Sans" }}
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
                  padding: "12px 14px",
                }}
                labelStyle={{ color: "#9CA3AF", marginBottom: "6px", fontWeight: 500 }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                formatter={(val: number, name: string) => {
                  const label =
                    name === "positive"
                      ? "Positive"
                      : name === "negative"
                      ? "Negative"
                      : "Neutral";
                  return [val.toLocaleString(), label];
                }}
              />
              <Bar dataKey="negative" stackId="sentiment" fill="#EF4444" />
              <Bar dataKey="neutral" stackId="sentiment" fill="#F59E0B" />
              {/* <Bar dataKey="positive" stackId="sentiment" fill="#10B981" radius={[4, 4, 0, 0]} /> */}
              <Bar
                dataKey="positive"
                stackId="sentiment"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                label={({ x, y, width, index }) => {
                  const total = data[index].mentions;

                  if (total < 300) return null; // optional sanity filter

                  return (
                    <text
                      x={x + width / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fill="#b3b7bec6"
                      fontWeight={500}
                    >
                      {formatNumber(total)}
                    </text>
                  );
                }}
              />            
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 8, right: 6, left: -20, bottom: 6 }}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "IBM Plex Sans" }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "IBM Plex Sans" }}
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
                  padding: "12px 14px",
                }}
                labelStyle={{ color: "#9CA3AF", marginBottom: "6px", fontWeight: 500 }}
                cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "4 4" }}
                formatter={(val: number, name: string) => {
                  const label =
                    name === "positive"
                      ? "Positive"
                      : name === "negative"
                      ? "Negative"
                      : "Neutral";
                  return [val.toLocaleString(), label];
                }}
              />
              <Area
                type="monotone"
                dataKey="positive"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#positiveGradient)"
                dot={(props) => (
                  <CustomDot
                    key={props.index}
                    cx={props.cx}
                    cy={props.cy}
                    index={props.index}
                    dataLength={data.length}
                    color="#10B981"
                  />
                )}
                activeDot={{ r: 5, fill: "#10B981", stroke: "white", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fill="url(#neutralGradient)"
                dot={(props) => (
                  <CustomDot
                    key={props.index}
                    cx={props.cx}
                    cy={props.cy}
                    index={props.index}
                    dataLength={data.length}
                    color="#F59E0B"
                  />
                )}
                activeDot={{ r: 5, fill: "#F59E0B", stroke: "white", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stroke="#EF4444"
                strokeWidth={2.5}
                fill="url(#negativeGradient)"
                dot={(props) => (
                  <CustomDot
                    key={props.index}
                    cx={props.cx}
                    cy={props.cy}
                    index={props.index}
                    dataLength={data.length}
                    color="#EF4444"
                  />
                )}
                activeDot={{ r: 5, fill: "#EF4444", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

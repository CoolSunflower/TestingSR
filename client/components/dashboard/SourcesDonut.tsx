import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Twitter", value: 50, color: "#3B82F6" },
  { name: "Facebook", value: 30, color: "#F4B400" },
  { name: "Instagram", value: 20, color: "#EF4444" },
]

function SourcesToolTip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; mentions: number; color: string } }> }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-lg bg-[#111827] text-white px-3 py-2 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-semibold" style={{ color: item.color }}>
        {item.name}
      </p>
      <p className="text-[12px] font-medium text-white">
        {item.value}% ({item.mentions.toLocaleString()} mentions)
      </p>
    </div>
  );
}

export default function SourcesDonut() {
  const totalMentions = 14208;
  const withMentions = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        mentions: Math.round((item.value / 100) * totalMentions),
      })),
    [],
  );
  const [activeName, setActiveName] = useState("Twitter");
  const activeSegment = withMentions.find((item) => item.name === activeName) ?? withMentions[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <h2 className="font-semibold text-gray-900 text-[17px]">
        Sources Distribution
      </h2>
      <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase mb-5">
        Twitter, Facebook, & Instagram
      </p>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="relative w-[180px] h-[180px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={withMentions}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={3}
                stroke="white"
                onMouseMove={(_, index) => {
                  if (typeof index === "number") {
                    setActiveName(withMentions[index].name);
                  }
                }}
                onMouseLeave={() => setActiveName("Twitter")}
                cursor="pointer"
              >
                {withMentions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={<SourcesToolTip />}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[28px] font-bold text-gray-900 leading-none">
              {activeSegment.value}%
            </span>
            <span
              className="text-[10px] font-semibold tracking-widest uppercase mt-1"
              style={{ color: activeSegment.color }}
            >
              {activeSegment.name}
            </span>
          </div>
        </div>

        {/* Legend
        <div className="w-full mt-5 space-y-2.5">
          {withMentions.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
              onMouseEnter={() => setActiveName(item.name)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800" title={`${item.mentions.toLocaleString()} mentions`}>
                {item.value}%
              </span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

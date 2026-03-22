import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Positive", value: 60, color: "#3B82F6" },
  { name: "Neutral", value: 25, color: "#F59E0B" },
  { name: "Negative", value: 15, color: "#EF4444" },
];

export default function SentimentDonut() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
      <h2 className="font-semibold text-gray-900 text-[15px] mb-4">
        Sentiment Distribution
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="relative w-[180px] h-[180px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={3}
                stroke="white"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[28px] font-bold text-gray-900 leading-none">
              60%
            </span>
            <span className="text-[10px] font-semibold text-blue-500 tracking-widest uppercase mt-1">
              Positive
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full mt-5 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

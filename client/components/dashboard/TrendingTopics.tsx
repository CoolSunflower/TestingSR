const topics = [
  { label: "Product Launch", count: "8.2k", width: "85%", color: "#3B82F6" },
  { label: "Customer Support", count: "6.1k", width: "65%", color: "#93C5FD" },
  { label: "Pricing Update", count: "4.3k", width: "45%", color: "#BFDBFE" },
  { label: "Mobile App", count: "2.8k", width: "28%", color: "#EF4444" },
  { label: "Pricing Update", count: "4.3k", width: "45%", color: "#BFDBFE" },
  { label: "Mobile App", count: "2.8k", width: "28%", color: "#EF4444" },
  { label: "Pricing Update", count: "4.3k", width: "45%", color: "#BFDBFE" },
  { label: "Mobile App", count: "2.8k", width: "28%", color: "#EF4444" },
];

export default function TrendingTopics() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900 text-[17px]">Trending Topics</h2>
        <span className="text-[11px] font-bold text-blue-500 tracking-widest uppercase">
          Insights
        </span>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-center">
        {topics.map((topic) => (
          <div key={topic.label} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-800 w-[130px] shrink-0">
              {topic.label}
            </span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: topic.width, backgroundColor: topic.color }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 w-10 text-right shrink-0">
              {topic.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

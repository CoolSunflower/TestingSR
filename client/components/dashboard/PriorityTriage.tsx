import { ChevronRight, SlidersHorizontal } from "lucide-react";

const triageItems = [
  {
    initials: "JD",
    source: "Twitter",
    issue: "Account lockout after new update",
    risk: 92,
    riskColor: "bg-red-500",
  },
  {
    initials: "JD",
    source: "Twitter",
    issue: "Account lockout after new update",
    risk: 92,
    riskColor: "bg-red-500",
  },
  {
    initials: "SW",
    source: "Reddit",
    issue: "Enterprise pricing transparency",
    risk: 85,
    riskColor: "bg-rose-400",
  },
];

export default function PriorityTriage() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900 text-[15px]">Priority Triage</h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-red-500 tracking-widest uppercase">
            3 High Risk
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {triageItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
              {item.initials}
            </div>

            {/* Source */}
            <div className="w-20 shrink-0">
              <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
                Source
              </p>
              <p className="text-sm font-semibold text-gray-800">{item.source}</p>
            </div>

            {/* Issue */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
                Issue
              </p>
              <p className="text-sm text-gray-800 truncate">{item.issue}</p>
            </div>

            {/* Risk badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`${item.riskColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-md`}
              >
                {item.risk} RISK
              </span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  change?: string;
  changeType?: "positive" | "negative";
}

function StatCard({ label, value, suffix, change, changeType }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[26px] font-bold text-gray-900 leading-none">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-gray-400 font-normal">{suffix}</span>
        )}
        {change && (
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ml-1 ${
              changeType === "positive" ? "text-green-500" : "text-red-500"
            }`}
          >
            {changeType === "positive" ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2L9 7H1L5 2Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 8L9 3H1L5 8Z" fill="currentColor" />
              </svg>
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function SourcesCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
        Sources
      </p>
      <div className="flex gap-1 mb-2 mt-1">
        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: "40%" }} />
        <div className="h-1.5 rounded-full bg-orange-400" style={{ width: "35%" }} />
        <div className="h-1.5 rounded-full bg-green-400" style={{ width: "25%" }} />
      </div>
      <div className="flex gap-4 mt-2">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">X</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Reddit</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Alerts</span>
      </div>
    </div>
  );
}

export default function StatsRow() {
  return (
    <div className="flex gap-3 flex-wrap">
      <StatCard
        label="Brand Health"
        value="92"
        suffix="/100"
        change="12.5%"
        changeType="positive"
      />
      <StatCard
        label="Risk Score"
        value="18"
        suffix="/100"
        change="2.1%"
        changeType="negative"
      />
      <StatCard
        label="Total Mentions Today"
        value="14,208"
        change="12.5%"
        changeType="positive"
      />
      <SourcesCard />
    </div>
  );
}

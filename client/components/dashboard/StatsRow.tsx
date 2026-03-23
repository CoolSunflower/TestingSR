import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  change?: number;
  changeType?: "positive" | "negative";
  color?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  change,
  changeType,
  color = "infer",
}: StatCardProps) {
  const accentGradient = "linear-gradient(180deg, #6B7280 0%, #D1D5DB 100%)";

  const bg_color = color === "infer" ? (changeType === "positive" ? "#EAF8F1" : "#FDEEEF") : color;
  const text_color = color === "infer" ? (changeType === "positive" ? "#159A62" : "#D33B47") : color;

  return (
    <div className="relative min-w-0 px-4 sm:px-5 py-3.5 xl:py-4.5">
      <div
        className="absolute left-0 top-3.5 h-[66px] w-[2px] rounded-full"
        style={{ backgroundImage: accentGradient }}
      />
      <p className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] tracking-[0.16em] uppercase mb-2">
        {label}
      </p>
      <div className="flex items-end gap-1 flex-wrap">
        <span className="text-[50px] sm:text-[54px] leading-[0.82] font-semibold text-[#0F172A] tracking-[-0.03em]">
          {value}
        </span>
        {suffix && (
          <span className="text-[22px] leading-none text-[#6B7280] font-normal mb-[8px]">
            {suffix}
          </span>
        )}
        {typeof change === "number" && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-[11px] font-semibold ml-2 mb-1 bg-[${bg_color}] text-[${text_color}]`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function SourcesCard() {
  const sources = useMemo(
    () => [
      {
        key: "x",
        label: "X",
        share: 40,
        mentions: 5683,
        trend: "+8.1%",
        color: "#3B82F6",
      },
      {
        key: "reddit",
        label: "Reddit",
        share: 35,
        mentions: 4973,
        trend: "+3.4%",
        color: "#F97316",
      },
      {
        key: "alerts",
        label: "Alerts",
        share: 25,
        mentions: 3552,
        trend: "-1.2%",
        color: "#10B981",
      },
    ],
    [],
  );
  const [activeSource, setActiveSource] = useState(sources[0]);
  const [isHoveringSources, setIsHoveringSources] = useState(false);
  const sourceStarts = useMemo(() => {
    let cumulative = 0;
    return sources.map((source) => {
      const start = cumulative;
      cumulative += source.share;
      return { key: source.key, start };
    });
  }, [sources]);

  return (
    <div
      className="relative min-w-0 px-4 sm:px-5 py-3.5 xl:py-4.5"
      onMouseEnter={() => setIsHoveringSources(true)}
      onMouseLeave={() => setIsHoveringSources(false)}
      onFocusCapture={() => setIsHoveringSources(true)}
      onBlurCapture={() => setIsHoveringSources(false)}
    >
      <div
        className="absolute left-0 top-3.5 h-[66px] w-[2px] rounded-full"
        style={{ backgroundImage: "linear-gradient(180deg, #4B5563 0%, #D1D5DB 100%)" }}
      />
      <p className="text-[10px] sm:text-[11px] font-medium text-[#6B7280] tracking-[0.16em] uppercase mb-2">
        Sources
      </p>
      <div className="flex gap-[2px] mb-1.5 mt-1 rounded-full overflow-hidden bg-[#E5E7EB]">
        {sources.map((source) => (
          <button
            key={source.key}
            type="button"
            onMouseEnter={() => setActiveSource(source)}
            onFocus={() => setActiveSource(source)}
            className="h-3.5 transition-opacity hover:opacity-85 focus:outline-none focus:opacity-85"
            style={{ width: `${source.share}%`, backgroundColor: source.color }}
            aria-label={`${source.label} sources`}
          />
        ))}
      </div>
      <div className="relative mt-2 h-4">
        {sources.map((source) => {
          const start = sourceStarts.find((item) => item.key === source.key)?.start ?? 0;
          const alertsVisible = source.key !== "alerts" || activeSource.key === "alerts";

          return (
            <button
              key={source.key}
              type="button"
              onMouseEnter={() => setActiveSource(source)}
              onFocus={() => setActiveSource(source)}
              className={`absolute text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                activeSource.key === source.key ? "text-[#4B5563]" : "text-[#9CA3AF]"
              } ${alertsVisible ? "opacity-100" : "opacity-0"}`}
              style={{ left: `${start}%` }}
            >
              {source.label}
            </button>
          );
        })}
      </div>
      <p
        className={`mt-1.5 text-[11px] text-[#4B5563] leading-tight truncate transition-opacity ${
          isHoveringSources ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-semibold">{activeSource.label}</span>{" "}
        {activeSource.mentions.toLocaleString()} mentions ({activeSource.share}%), {activeSource.trend} vs yesterday.
      </p>
    </div>
  );
}

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1.5 xl:gap-0">
      <StatCard
        label="Brand Health"
        value="92"
        suffix="/100"
        change={12.5}
        changeType="positive"
      />
      <StatCard
        label="Risk Score"
        value="18"
        suffix="/100"
        change={2.1}
        changeType="negative"
      />
      <StatCard
        label="Total Mentions Today"
        value="14,208"
        change={12.5}
        changeType="positive"
      />
      <SourcesCard />
    </div>
  );
}

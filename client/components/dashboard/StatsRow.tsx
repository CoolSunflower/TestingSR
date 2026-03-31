import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  change?: number;
  changeType?: "positive" | "negative";
  text_color_forced?: string;
  bg_color_forced?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  change,
  changeType,
  text_color_forced = "infer",
  bg_color_forced = "infer",
}: StatCardProps) {
  const accentGradient = "linear-gradient(180deg, #6B7280 0%, #D1D5DB 100%)";

  const bg_color = bg_color_forced === "infer" ? (changeType === "positive" ? "#EAF8F1" : "#FDEEEF") : bg_color_forced;
  const text_color = text_color_forced === "infer" ? (changeType === "positive" ? "#159A62" : "#D33B47") : text_color_forced;

  console.log("bg_color:", bg_color, "text_color:", text_color, label, changeType);

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
          {/* special case for Risk Score, if value is higher than 50 color it red */}
          {
            label === "Risk Score" && parseInt(value) > 50 ? (
              <span style={{ color: "#D33B47" }}>{value}</span>
            ) : (
              value
            )
          }
        </span>
        {suffix && (
          <span className="text-[22px] leading-none text-[#6B7280] font-normal mb-[8px]">
            {suffix}
          </span>
        )}
        {typeof change === "number" && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-[11px] font-semibold ml-2`}
              style={{
                backgroundColor: bg_color,
                color: text_color,
              }}
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

function SentimentCard() {
  const sentiments = useMemo(
    () => [
      {
        key: "positive",
        label: "Positive",
        share: 40,
        mentions: 5683,
        trend: "+8.1%",
        color: "#3bf670",
      },
      {
        key: "neutral",
        label: "Neutral",
        share: 35,
        mentions: 4973,
        trend: "+3.4%",
        color: "#F4B400",
      },
      {
        key: "negative",
        label: "Negative",
        share: 25,
        mentions: 3552,
        trend: "-1.2%",
        color: "#EF4444",
      },
    ],
    [],
  );

  const [activeSource, setActiveSource] = useState(sentiments[0]);
  const [isHoveringSources, setIsHoveringSources] = useState(false);
  const sourceStarts = useMemo(() => {
    let cumulative = 0;
    return sentiments.map((sentiment) => {
      const start = cumulative;
      cumulative += sentiment.share;
      return { key: sentiment.key, start };
    });
  }, [sentiments]);

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
        Sentiment
      </p>
      <div className="relative mb-1 mt-4">
        <div className="flex gap-[2px] mb-1.5 mt-1 rounded-full overflow-hidden bg-[#E5E7EB]">
          {sentiments.map((sentiment) => (
            <button
              key={sentiment.key}
              type="button"
              onMouseEnter={() => setActiveSource(sentiment)}
              onFocus={() => setActiveSource(sentiment)}
              className="h-3.5 transition-opacity hover:opacity-85 focus:outline-none focus:opacity-85"
              style={{ width: `${sentiment.share}%`, backgroundColor: sentiment.color }}
              aria-label={`${sentiment.label} sources`}
            />
          ))}
        </div>
        {/* % labels above bar */}
        {sentiments.map((sentiment, i) => {
          const start = sourceStarts[i].start;
          const center = start + sentiment.share / 2;

          return (
            <span
              key={sentiment.key}
              className="absolute text-[10px] font-semibold text-[#878d96]"
              style={{
                left: `${center}%`,
                transform: "translateX(-50%)",
                top: "-14px",
              }}
            >
              {sentiment.share}%
            </span>
          );
        })}
      </div>
      <div className="relative mt-2 h-4">
        {sentiments.map((sentiment) => {
          const start = sourceStarts.find((item) => item.key === sentiment.key)?.start ?? 0;
          const alertsVisible = sentiment.key !== "alerts" || activeSource.key === "alerts";

          return (
            <button
              key={sentiment.key}
              type="button"
              onMouseEnter={() => setActiveSource(sentiment)}
              onFocus={() => setActiveSource(sentiment)}
              className={`absolute text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                activeSource.key === sentiment.key ? "text-[#4B5563]" : "text-[#9CA3AF]"
              } ${alertsVisible ? "opacity-100" : "opacity-0"}`}
              style={{ left: `${start}%` }}
            >
              {sentiment.label}
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
        value="57"
        suffix="/100"
        change={2.1} // say it went down by 2.1 points, which is a good thing!
        changeType="negative" // for arrow direction, but we'll force the colors to be positive since a decrease in risk is good
        bg_color_forced="#EAF8F1" // light green background for positive change
        text_color_forced="#159A62" // green text for positive change
      />
      <StatCard
        label="Total Mentions Today"
        value="14,208"
        change={12.5} 
        changeType="negative"
      />
      <SentimentCard />
    </div>
  );
}

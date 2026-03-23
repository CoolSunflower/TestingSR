import { Download, Flag, Bookmark, Twitter, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { StatCard } from "@/components/dashboard/StatsRow";
import { FilterRow, FilterRow2 } from "@/components/FilterRow";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1.5 xl:gap-0">
      <StatCard
        label="Total Mentions"
        value="14,208"
      />
      <StatCard
        label="High Risk Alerts (Today)"
        value="92"
        change={12.5}
        changeType="positive"
        color="#D33B47"
      />
      <StatCard
        label="Positive Sentiment"
        value="18%"
        change={2.1}
        changeType="negative"
      />
      <StatCard
        label="Negative Sentiment"
        value="49%"
        change={2.1}
        changeType="positive"
        color="#D33B47"
      />
    </div>
  );
}

type MentionData = {
  id: number;
  author: string;
  platform: "Twitter" | "Facebook" | "Instagram" | "LinkedIn" | "Reddit";
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  risk: number;
  flagged?: boolean;
  saved?: boolean;
};

function generateRandomData(count: number): MentionData[] {
  const data: MentionData[] = [];
  const authors = ["@alice_jones", "@bob_smith", "@charlie_dev", "@diana_tech", "@eve_marketing"];
  const platforms: MentionData["platform"][] = ["Twitter", "Facebook", "Instagram", "LinkedIn", "Reddit"];
  const contents = [
    "This product is absolutely amazing! Best purchase I've made this year. Having some issues with the customer service, not very satisfied.",
    "Having some issues with the customer service, not very satisfied.",
    "The new update is great but could use some improvements in the UI. Having some issues with the customer service, not very satisfied.",
    "Just okay, nothing special. Expected more for the price. Having some issues with the customer service, not very satisfied.",
    "Terrible experience, would not recommend to anyone!",
  ];
  const sentiments: MentionData["sentiment"][] = ["positive", "neutral", "negative"];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      author: authors[Math.floor(Math.random() * authors.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      risk: Math.floor(Math.random() * 100),
      flagged: Math.random() > 0.8,
      saved: Math.random() > 0.8,
    });
  }

  return data;
}

const PLATFORM_ICONS = {
  Twitter: Twitter,
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Reddit: MessageCircle,
};

const PLATFORM_COLORS = {
  Twitter: "text-[#1DA1F2]",
  Facebook: "text-[#1877F2]",
  Instagram: "text-[#E4405F]",
  LinkedIn: "text-[#0A66C2]",
  Reddit: "text-[#FF4500]",
};

function MentionsTable() {
  const [data, setData] = useState<MentionData[]>(() => generateRandomData(20));
  const [activeViews, setActiveViews] = useState<string[]>([]);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);

  const toggleView = (view: string) => {
    setActiveViews((prev) =>
      prev.includes(view) ? prev.filter((v) => v !== view) : [...prev, view]
    );
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleFlag = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item
      )
    );
  };

  const toggleSave = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200";
      case "negative":
        return "bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200";
    }
  };

  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 70) return "bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200";
    if (risk >= 40) return "bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200";
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200";
  };

  const getRowBorderColor = (sentiment: string, risk: number) => {
    if (risk >= 70) return "border-l-4 border-l-rose-400";
    if (sentiment === "positive") return "border-l-4 border-l-emerald-400";
    if (sentiment === "negative") return "border-l-4 border-l-rose-400";
    return "border-l-4 border-l-slate-200";
  };

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="flex items-center justify-between gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <div className="space-y-4">
          {/* View Toggles */}
          <div>
            {/* <label className="text-[10px] font-medium text-gray-500 tracking-[0.12em] uppercase mb-2 block">
              View
            </label> */}
            <div className="flex flex-wrap gap-2">
              {["Flagged", "Saved"].map((view) => (
                <Button
                  key={view}
                  variant={activeViews.includes(view) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleView(view)}
                  className={cn(
                    "h-8 text-xs font-medium transition-all",
                    activeViews.includes(view)
                      ? view === "Flagged"
                        ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-sm"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  )}
                >
                  {view === "Flagged" && <Flag size={12} className="mr-1" />}
                  {view === "Saved" && <Bookmark size={12} className="mr-1" />}
                  {view}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-[15px] font-medium">
          <span className="text-gray-500">Viewing</span>{" "}
          <span className="text-blue-600 font-semibold">{data.length}</span>{" "}
          <span className="text-gray-500">out of {data.length} mentions</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-50 hover:to-slate-50 border-b border-gray-200">
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase">
                Author
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase">
                Platform
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase">
                Content
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase">
                Sentiment
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase">
                Risk
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-700 tracking-[0.12em] uppercase text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  No mentions found
                </TableCell>
              </TableRow>
            ) : (
              data.map((mention) => {
                const PlatformIcon = PLATFORM_ICONS[mention.platform];
                const platformColor = PLATFORM_COLORS[mention.platform];
                return (
                  <TableRow
                    key={mention.id}
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors",
                      getRowBorderColor(mention.sentiment, mention.risk),
                      mention.risk >= 70 && "bg-rose-50/20"
                    )}
                  >
                    <TableCell className="font-medium text-sm text-gray-900">
                      {mention.author}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlatformIcon size={18} className={platformColor} />
                        <span className="text-sm text-gray-700 font-medium">{mention.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-gray-600 line-clamp-2">{mention.content}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider",
                          getSentimentBadgeColor(mention.sentiment)
                        )}
                      >
                        {mention.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-bold tracking-wider",
                          getRiskBadgeColor(mention.risk)
                        )}
                      >
                        {mention.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 transition-all",
                            mention.flagged
                              ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          )}
                          onClick={() => toggleFlag(mention.id)}
                        >
                          <Flag size={16} fill={mention.flagged ? "currentColor" : "none"} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 transition-all",
                            mention.saved
                              ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          )}
                          onClick={() => toggleSave(mention.id)}
                        >
                          <Bookmark size={16} fill={mention.saved ? "currentColor" : "none"} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function Index() {
  // Filter states
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Mock data for dropdowns
  const keywordOptions = [
    { label: "Product Launch", value: "product-launch" },
    { label: "Customer Service", value: "customer-service" },
    { label: "Pricing", value: "pricing" },
    { label: "Quality", value: "quality" },
  ];

  const sentimentOptions = [
    { label: "Positive", value: "positive" },
    { label: "Neutral", value: "neutral" },
    { label: "Negative", value: "negative" },
  ];

  const platformOptions = [
    { label: "Twitter", value: "twitter" },
    { label: "Facebook", value: "facebook" },
    { label: "Instagram", value: "instagram" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Reddit", value: "reddit" },
  ];

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      keywords: selectedKeywords,
      dateRange,
      sentiment: selectedSentiment,
      platforms: selectedPlatforms,
    });
    // TODO: Implement filter logic here
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0" y="0" width="5" height="5" rx="1" fill="url(#grad1)" />
              <rect x="7" y="0" width="5" height="5" rx="1" fill="url(#grad2)" />
              <rect x="0" y="7" width="5" height="5" rx="1" fill="url(#grad3)" />
              <rect x="7" y="7" width="5" height="5" rx="1" fill="url(#grad4)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="5" y2="5">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="grad2" x1="7" y1="0" x2="12" y2="5">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="grad3" x1="0" y1="7" x2="5" y2="12">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad4" x1="7" y1="7" x2="12" y2="12">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
            Workspace
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-semibold">Mentions</span>
        </div>

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] leading-[0.95] font-normal text-[#111827] tracking-[-0.03em]">
            Mentions
          </h1>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all border border-blue-200 bg-gradient-to-br from-white to-blue-50/30 shrink-0 shadow-sm hover:shadow">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <StatsRow />

        {/* Filter Row */}
        <FilterRow
          keywordOptions={keywordOptions}
          selectedKeywords={selectedKeywords}
          onKeywordsChange={setSelectedKeywords}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sentimentOptions={sentimentOptions}
          selectedSentiment={selectedSentiment}
          onSentimentChange={setSelectedSentiment}
          platformOptions={platformOptions}
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
          onApplyFilters={handleApplyFilters}
        />

        {/* Mentions Table */}
        <MentionsTable />

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
            © 2024 SocialRumr AI Engine • V4.2.0-Stable
          </p>
        </footer>
      </div>
    </div>
  );
}

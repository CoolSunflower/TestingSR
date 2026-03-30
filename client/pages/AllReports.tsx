import Navbar from "@/components/Navbar";
import { Calendar, CheckCircle, AlertTriangle, ArrowRight, Shield, } from "lucide-react";
import { cn } from "@/lib/utils";

interface Report {
  id: number;
  title: string;
  dateRange: [string, string];
  emergingTopics: string[];
  contentSnippet: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  publishedAgo: string;
  actionButtonText: string;
  changeMetrics: {
    mentionsDelta: number;
    sentimentDelta: number;
    spike?: string;
  };
}

function RiskScoreCircle({ score, level }: { score: number; level: "low" | "medium" | "high" }) {
  const colorMap = {
    low: "text-green-600 border-green-600",
    medium: "text-indigo-600 border-indigo-600",
    high: "text-red-600 border-red-600"
  };

  const iconMap = {
    low: <CheckCircle className="w-6 h-6" />,
    medium: <Shield className="w-6 h-6" />,
    high: <AlertTriangle className="w-6 h-6" />
  };

  const percentage = score;

  return (
    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          Risk Score
        </p>
        <p className={cn("text-2xl font-extrabold", colorMap[level].split(' ')[0])}>
          {score} / 100
        </p>
      </div>
      <div className={cn("w-16 h-16 rounded-full border-4 flex items-center justify-center relative", colorMap[level])}>
        <div
          className={cn("absolute inset-0 rounded-full border-4", colorMap[level])}
          style={{
            clipPath: `polygon(50% 50%, 50% 0, 100% 0, 100% ${percentage}%, 50% 50%)`
          }}
        />
        <div className="relative z-10">
          {iconMap[level]}
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  const borderColorMap = {
    low: "border-green-600",
    medium: "border-indigo-600",
    high: "border-red-600"
  };

  const badgeColorMap = {
    low: "bg-green-100 text-green-800",
    medium: "bg-indigo-100 text-indigo-800",
    high: "bg-red-100 text-red-800"
  };

  const riskLabelMap = {
    low: "Low Risk",
    medium: "In Review",
    high: "High Risk"
  };

  return (
    <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden cursor-pointer">
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", borderColorMap[report.riskLevel])} />

      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
              {report.title}
            </h3>
            <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {report.dateRange[0]} - {report.dateRange[1]}
            </p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", badgeColorMap[report.riskLevel])}>
            {riskLabelMap[report.riskLevel]}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-4">
          {report.contentSnippet}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Emerging Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {report.emergingTopics.map((topic, index) => (
                <span
                  key={index}
                  className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Trend Changes
            </p>

            <div className="space-y-2 max-w-[300px]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Mentions</span>
                <span className="font-semibold text-green-600">
                  ↑ {report.changeMetrics.mentionsDelta}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Negative Sentiment</span>
                <span className="font-semibold text-red-600">
                  ↑ {report.changeMetrics.sentimentDelta}%
                </span>
              </div>

              {report.changeMetrics.spike && (
                <div className="text-sm text-indigo-600 font-medium">
                  Spike: {report.changeMetrics.spike}
                </div>
              )}
            </div>
          </div>

          <RiskScoreCircle score={report.riskScore} level={report.riskLevel} />
        </div>
      </div>

      <div className="flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
        <div className="text-right hidden md:block">
          <p className="text-xs font-medium text-slate-400">Published</p>
          <p className="text-sm font-bold text-gray-900">{report.publishedAgo}</p>
        </div>
        <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-4 transition-all">
          {report.actionButtonText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ReportsTable() {
  const reports: Report[] = [
    {
      id: 1,
      title: "January 2024 Analysis",
      dateRange: ["Jan 01, 2024", "Jan 31, 2024"],
      contentSnippet: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      emergingTopics: ["Sustainable Finance", "AI Governance", "Global Supply Chains"],
      riskScore: 12,
      riskLevel: "low",
      publishedAgo: "2 days ago",
      actionButtonText: "View Full Analysis",
      changeMetrics: {
        mentionsDelta: 32,
        sentimentDelta: 18,
        spike: "Jan 12-14"
      }
    },
    {
      id: 2,
      title: "February 2024 Analysis",
      dateRange: ["Feb 01, 2024", "Feb 28, 2024"],
      contentSnippet: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      emergingTopics: ["Trade Sanctions", "Energy Security", "Cyber Sovereignty"],
      riskScore: 89,
      riskLevel: "high",
      publishedAgo: "5 hours ago",
      actionButtonText: "Investigate Now",
      changeMetrics: {
        mentionsDelta: 76,
        sentimentDelta: 41,
        spike: "Feb 10-13"
      }
    }
  ];

  return (
    <div>
      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-8">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}

export default function AllReports() {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-6 space-y-6">
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
          <span className="text-gray-600 font-semibold">Reports</span>
        </div>

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] leading-[0.95] font-normal text-[#111827] tracking-[-0.03em]">
              Reports
            </h1>
          </div>
        </div>

        <ReportsTable />

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
            © 2026 SocialRumr AI Engine • V4.2.0-Stable
          </p>
        </footer>
      </div>
    </div>
  );
}

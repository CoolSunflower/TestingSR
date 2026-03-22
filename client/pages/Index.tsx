import { Upload, Settings, Zap, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsRow from "@/components/dashboard/StatsRow";
import MentionsChart from "@/components/dashboard/MentionsChart";
import SentimentDonut from "@/components/dashboard/SentimentDonut";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import PriorityTriage from "@/components/dashboard/PriorityTriage";
import NarrativeDigest from "@/components/dashboard/NarrativeDigest";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 py-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="0" y="0" width="5" height="5" rx="1" fill="#9CA3AF" />
              <rect x="7" y="0" width="5" height="5" rx="1" fill="#9CA3AF" />
              <rect x="0" y="7" width="5" height="5" rx="1" fill="#9CA3AF" />
              <rect x="7" y="7" width="5" height="5" rx="1" fill="#9CA3AF" />
            </svg>
            Workspace
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600">Action Center</span>
        </div>

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] leading-[0.95] font-normal text-[#111827] tracking-[-0.03em]">
            Action Center
          </h1>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors border border-gray-200 bg-white shrink-0">
              <Upload size={16} />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors border border-gray-200 bg-white shrink-0">
              <Settings size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors shrink-0">
              <Zap size={14} className="text-yellow-500" />
              Generate brief
            </button>
            <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-[#10131A] transition-colors shadow-[0_8px_16px_rgba(0,0,0,0.16)] shrink-0">
              <Download size={14} />
              Download today's report
            </button>
          </div>
        </div>

        {/* Stats row */}
        <StatsRow />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <MentionsChart />
          <SentimentDonut />
        </div>

        {/* Trending + Priority Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          <TrendingTopics />
          <PriorityTriage />
        </div>

        {/* Narrative Digest */}
        <NarrativeDigest />

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

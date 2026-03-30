import Navbar from "@/components/Navbar";
import { Calendar, CheckCircle, AlertTriangle, ArrowRight, Shield, Phone, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Report {
  id: number;
  title: string;
  date: string;
  emergingTopics: string[];
  minutesSnippet: string;
  publishedAgo: string;
  actionButtonText: string;
  changeMetrics: {
    mentionsDelta: number;
    sentimentDelta: number;
    spike?: string;
  };
}

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden cursor-pointer">
      <div className="absolute left-0 top-0 bottom-0 w-1" />

      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
              {report.title}
            </h3>
            <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {report.date}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-4">
          {report.minutesSnippet}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
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

            <div className="space-y-2">
              {report.changeMetrics.spike && (
                <div className="text-sm text-indigo-600 font-medium">
                  Spike: {report.changeMetrics.spike}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-green-600">
                  ↑ {report.changeMetrics.mentionsDelta}%
                </span>
                <span className="text-gray-500">Mentions</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-red-600">
                  ↑ {report.changeMetrics.sentimentDelta}%
                </span>
                <span className="text-gray-500">Negative Sentiment</span>
              </div>
            </div>
          </div>
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

function ConsultingTable() {
  const minutes: Report[] = [
    {
      id: 1,
      title: "January 2024 Meeting",
      date: "Jan 01, 2024",
      minutesSnippet: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      emergingTopics: ["Sustainable Finance", "AI Governance", "Global Supply Chains"],
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
      title: "February 2024 Meeting",
      date: "Feb 01, 2024",
      minutesSnippet: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      emergingTopics: ["Trade Sanctions", "Energy Security", "Cyber Sovereignty"],
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
      {/* Minutes Grid */}
      <div className="grid grid-cols-1 gap-8">
        {minutes.map(minute => (
          <ReportCard key={minute.id} report={minute} />
        ))}
      </div>
    </div>
  );
}

function RequestCallModal() {
  const [open, setOpen] = useState(false);
  const [preferredDate1, setPreferredDate1] = useState("");
  const [preferredTime1, setPreferredTime1] = useState("");
  const [preferredDate2, setPreferredDate2] = useState("");
  const [preferredTime2, setPreferredTime2] = useState("");
  const [preferredDate3, setPreferredDate3] = useState("");
  const [preferredTime3, setPreferredTime3] = useState("");
  const [discussionPoints, setDiscussionPoints] = useState("");

  const handleConfirmMeeting = () => {
    // Format the email body
    const emailBody = `Hello SocialRumr Team,

We would like to request a consultation call. Here are my details:

Preffered Date & Time Options:
${preferredDate1 && preferredTime1 ? `1. ${preferredDate1} at ${preferredTime1}` : ''}
${preferredDate2 && preferredTime2 ? `2. ${preferredDate2} at ${preferredTime2}` : ''}
${preferredDate3 && preferredTime3 ? `3. ${preferredDate3} at ${preferredTime3}` : ''}

Discussion Points:
${discussionPoints || 'No specific points mentioned'}

Looking forward to connecting with you.

Best regards`;

    const subject = "Consultation Call Request";
    const mailtoLink = `mailto:support@socialrumr.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    // Reset form and close modal
    setPreferredDate1("");
    setPreferredTime1("");
    setPreferredDate2("");
    setPreferredTime2("");
    setPreferredDate3("");
    setPreferredTime3("");
    setDiscussionPoints("");
    setOpen(false);
  };

  const hasAtLeastOneSlot = (preferredDate1 && preferredTime1) || 
                             (preferredDate2 && preferredTime2) || 
                             (preferredDate3 && preferredTime3);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-400 hover:bg-indigo-500 text-white shadow-md hover:shadow-lg transition-all">
          <Phone size={16} className="mr-2" />
          Request Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Request a Consultation Call
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Share your preferred times and discussion topics. We'll reach out to confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preferred Times Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" />
              <label className="text-sm font-semibold text-gray-700">
                Preferred Date & Time Options
              </label>
            </div>
            {/* <p className="text-xs text-gray-500 pl-6">
              Provide 2-3 options that work for you (we'll confirm one)
            </p> */}

            {/* Option 1 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Option 1 <span className="text-xs text-gray-500">(Required)</span></p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={preferredDate1}
                  onChange={(e) => setPreferredDate1(e.target.value)}
                  className="h-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  type="time"
                  value={preferredTime1}
                  onChange={(e) => setPreferredTime1(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Option 2 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Option 2</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={preferredDate2}
                  onChange={(e) => setPreferredDate2(e.target.value)}
                  className="h-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  type="time"
                  value={preferredTime2}
                  onChange={(e) => setPreferredTime2(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Option 3 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Option 3 (Optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={preferredDate3}
                  onChange={(e) => setPreferredDate3(e.target.value)}
                  className="h-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  type="time"
                  value={preferredTime3}
                  onChange={(e) => setPreferredTime3(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Discussion Points Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-600" />
              <label className="text-sm font-semibold text-gray-700">
                Discussion Points (Optional)
              </label>
            </div>
            <Textarea
              // placeholder="What would you like to discuss? (e.g., brand monitoring strategy, competitor analysis, reporting customization...)"
              placeholder="Any specific topics or questions you'd like to cover during the call?"
              value={discussionPoints}
              onChange={(e) => setDiscussionPoints(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleConfirmMeeting}
              disabled={!hasAtLeastOneSlot}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-11"
            >
              Confirm Meeting Request
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Consulting() {
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
          <span className="text-gray-600 font-semibold">Consulting</span>
        </div>

        {/* Page header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] leading-[0.95] font-normal text-[#111827] tracking-[-0.03em]">
              Consulting
            </h1>
          </div>
          <RequestCallModal />
        </div>

        <ConsultingTable />

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

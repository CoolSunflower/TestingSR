import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Bell } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Mentions", path: "/Mentions" },
  { label: "Segments", path: "/segments" },
  { label: "Risks", path: "/risks" },
  { label: "Profile", path: "/MonitoringProfile" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-[#F5F6F8] border-b border-[#ECEEF2] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 min-h-[70px] md:h-[76px] flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 py-2 md:py-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}Icon.svg`}
            alt="SocialRumr icon"
            className="w-[26px] h-[26px] object-contain"
          />
          <span className="font-semibold text-[20px] sm:text-[22px] leading-none text-[#0F172A] tracking-[-0.02em]">
            SocialRumr
          </span>
        </Link>

        {/* Nav Items */}
        <nav className="order-3 md:order-none w-full md:w-auto md:flex-1 flex items-center md:justify-center overflow-x-auto">
          <div className="inline-flex items-center rounded-[18px] bg-[#ECEDEF] p-1 min-w-max mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-[14px] text-[13px] sm:text-[15px] font-medium transition-all ${
                  isActive
                    ? "bg-black text-white shadow-[0_6px_12px_rgba(0,0,0,0.16)]"
                    : "text-[#626973] hover:text-[#1F2937] hover:bg-white/70"
                }`}
              >
                {isActive && (
                  <span className="inline-flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect x="0" y="0" width="5.5" height="5.5" rx="1" fill="white" opacity="0.85" />
                      <rect x="8.5" y="0" width="5.5" height="5.5" rx="1" fill="white" opacity="0.85" />
                      <rect x="0" y="8.5" width="5.5" height="5.5" rx="1" fill="white" opacity="0.85" />
                      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="white" opacity="0.85" />
                    </svg>
                    {item.label}
                  </span>
                )}
                {!isActive && item.label}
              </Link>
            );
          })}
          </div>
        </nav>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0">
          <button className="p-1.5 text-[#6B7280] hover:text-[#111827] transition-colors" aria-label="Open messages">
            <MessageSquare size={20} strokeWidth={1.9} />
          </button>
          <button className="p-1.5 text-[#6B7280] hover:text-[#111827] transition-colors" aria-label="Open notifications">
            <Bell size={20} strokeWidth={1.9} />
          </button>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E7E3D7] border border-[#DDD8C9]" />
          <div className="sr-only" aria-live="polite">
            User profile
          </div>
        </div>
      </div>
    </header>
  );
}

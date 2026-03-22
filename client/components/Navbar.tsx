import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Bell } from "lucide-react";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Content", path: "/content" },
  { label: "Segments", path: "/segments" },
  { label: "Risks", path: "/risks" },
  { label: "Integrations", path: "/integrations" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="0" y="0" width="8" height="8" rx="1.5" fill="#111827" />
            <rect x="12" y="0" width="8" height="8" rx="1.5" fill="#111827" />
            <rect x="0" y="12" width="8" height="8" rx="1.5" fill="#111827" />
            <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#111827" />
          </svg>
          <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
            SocialRumr
          </span>
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {isActive && (
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="0" y="0" width="5.5" height="5.5" rx="1" fill="white" opacity="0.8" />
                      <rect x="8.5" y="0" width="5.5" height="5.5" rx="1" fill="white" opacity="0.8" />
                      <rect x="0" y="8.5" width="5.5" height="5.5" rx="1" fill="white" opacity="0.8" />
                      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="white" opacity="0.8" />
                    </svg>
                    {item.label}
                  </span>
                )}
                {!isActive && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageSquare size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

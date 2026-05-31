import { RefreshCw, Download, User, Menu } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { useState } from "react";

interface HeaderProps {
  activeScreen: "dashboard" | "history" | "analytics" | "settings";
  setActiveScreen: (screen: "dashboard" | "history" | "analytics" | "settings") => void;
  onRefresh: () => void;
  onDownloadReport: () => void;
  googleUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  activeScreen,
  setActiveScreen,
  onRefresh,
  onDownloadReport,
  googleUser,
  onLogin,
  onLogout
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Derive display initials
  const getInitials = () => {
    if (googleUser && googleUser.displayName) {
      const parts = googleUser.displayName.split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return googleUser.displayName.substring(0, 2).toUpperCase();
    }
    return "G";
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-20 max-w-full bg-surface border-b border-[#c8c8bd]/30 z-10 flex-shrink-0 relative">
      {/* Mobile Brand Name & Menu Indicator */}
      <div className="md:hidden flex items-center gap-3">
        <Menu className="w-5 h-5 text-primary md:hidden" />
        <span className="font-display text-[11px] uppercase tracking-[0.25em] font-bold text-primary">FlowTracker</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-8 h-full pt-2 items-end">
        {(["dashboard", "history", "analytics", "settings"] as const).map((screen) => {
          const isActive = activeScreen === screen;
          const displayNames: Record<string, string> = {
            dashboard: "Dashboard",
            history: "History Logs",
            analytics: "Flow Trends",
            settings: "Settings"
          };
          return (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`pb-3.5 text-[10px] uppercase tracking-[0.2em] font-sans font-bold border-b-2 transition-all duration-150 ${
                isActive
                  ? "text-primary border-primary opacity-100"
                  : "text-[#2d2d2a] opacity-40 border-transparent hover:opacity-80"
              }`}
            >
              {displayNames[screen]}
            </button>
          );
        })}
      </div>

      {/* Top Bar Actions */}
      <div className="flex gap-4 items-center text-primary font-sans relative">
        <button
          onClick={onRefresh}
          title="Refresh active process tracker"
          className="p-2.5 hover:bg-white/60 md:bg-white/40 border border-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={onDownloadReport}
          title="Download report (CSV/JSON)"
          className="p-2.5 hover:bg-white/60 md:bg-white/40 border border-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer active:scale-95 text-primary"
        >
          <Download className="w-4 h-4" />
        </button>
        
        {/* Dynamic Connected Google profile avatar or button */}
        {googleUser ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              title="View Google Profile details"
              className="w-10 h-10 border border-black/5 hover:border-[#4a4a38]/30 rounded-full flex items-center justify-center overflow-hidden shadow-xs transition-colors cursor-pointer active:scale-95 shrink-0"
            >
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  referrerPolicy="no-referrer"
                  alt={googleUser.displayName || "Google avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#4a4a38] text-white flex items-center justify-center font-bold text-xs">
                  {getInitials()}
                </div>
              )}
            </button>

            {/* Dropdown details panel */}
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2.5 w-64 bg-surface rounded-2xl border border-black/10 p-4 shadow-xl z-50 animate-fadeIn font-sans"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex flex-col gap-2.5 border-b border-black/5 pb-3">
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#4a4a38]">Google Account</p>
                  <div>
                    <p className="text-xs font-bold text-on-surface truncate">{googleUser.displayName || "Google User"}</p>
                    <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{googleUser.email}</p>
                  </div>
                </div>
                <div className="pt-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveScreen("settings");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left text-[11px] font-semibold text-on-surface-variant hover:text-primary py-1 px-1 hover:bg-black/5 rounded-md transition-colors"
                  >
                    Account settings
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left text-[11px] font-bold text-red-700 hover:bg-red-50 py-1.5 px-1 rounded-md transition-colors"
                  >
                    Sign out / Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            title="Connect separate Google Profile"
            className="h-10 px-4 bg-[#4e654a] hover:bg-[#3d4f3a] text-white rounded-full flex items-center justify-center gap-2 font-sans font-extrabold text-[10px] uppercase tracking-widest shadow-xs transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span className="hidden sm:inline">Connect Google</span>
          </button>
        )}
      </div>
    </header>
  );
}


import { Calendar, BarChart3, Clock, Layers, HelpCircle, LogOut, User as UserIcon } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface SidebarProps {
  activeScreen: "dashboard" | "history" | "analytics" | "settings";
  setActiveScreen: (screen: "dashboard" | "history" | "analytics" | "settings") => void;
  onOpenManualLog: () => void;
  activeSessionDuration: string; // Dynamic state e.g., "2h 15m"
  googleUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  onOpenManualLog,
  activeSessionDuration,
  googleUser,
  onLogin,
  onLogout
}: SidebarProps) {
  return (
    <nav className="hidden md:flex flex-col h-screen py-8 px-5 gap-3 bg-surface border-r border-[#c8c8bd]/50 w-64 flex-shrink-0 z-20 font-serif">
      {/* Brand Header */}
      <div className="mb-8 px-2">
        <h1 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-primary opacity-80 select-none">FlowTracker</h1>
        <p className="font-display text-xl italic text-secondary mt-1">Organic Stream</p>
      </div>

      {/* Google User Profile Status Card */}
      <div className="flex flex-col p-4 mb-2 bg-[#f4f2ea]/90 rounded-[20px] border border-black/5 gap-3.5 shadow-2xs">
        {googleUser ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  referrerPolicy="no-referrer"
                  alt="Google Profile"
                  className="w-10 h-10 rounded-full object-cover border border-[#4a4a38]/20 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#4a4a38] text-white flex-shrink-0 flex items-center justify-center font-sans font-bold text-sm">
                  {googleUser.displayName?.substring(0, 2).toUpperCase() || "G"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-[#4a4a38]">Google Connected</p>
                <p className="font-sans text-xs text-on-surface font-semibold truncate leading-tight mt-0.5" title={googleUser.displayName || ""}>
                  {googleUser.displayName || "Google User"}
                </p>
                <p className="font-sans text-[10px] text-on-surface-variant truncate" title={googleUser.email || ""}>
                  {googleUser.email}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-1 font-sans text-[9px] font-bold uppercase tracking-wider text-red-700/80 hover:text-red-850 transition-colors text-left self-start cursor-pointer active:scale-95"
            >
              Disconnect profile
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex-shrink-0 flex items-center justify-center text-stone-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-stone-500">Google Profile</p>
                <p className="font-sans text-[10px] text-on-surface-variant leading-tight mt-0.5">
                  Unlinked Account
                </p>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="w-full font-sans text-[9px] font-bold uppercase tracking-widest bg-[#4a4a38] hover:bg-[#323225] py-2 px-3 rounded-full text-white flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3 h-3">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Connect Google</span>
            </button>
          </div>
        )}
      </div>

      {/* User Status Card */}
      <div className="flex items-center gap-3 p-4 mb-4 bg-white/40 rounded-[20px] border border-black/5">
        <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex-shrink-0 flex items-center justify-center font-sans tracking-normal">
          <UserIcon className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <p className="font-sans font-bold text-[10px] uppercase tracking-wider text-primary opacity-70">Tracked Time</p>
          <p className="font-mono text-xs text-on-surface-variant truncate mt-0.5">
            Active: <span className="text-secondary font-semibold">{activeSessionDuration}</span>
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 flex flex-col gap-1.5 font-sans">
        {/* Today (Dashboard) */}
        <button
          onClick={() => setActiveScreen("dashboard")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-full active:scale-[0.98] transition-all text-left uppercase text-[10px] tracking-widest font-bold ${
            activeScreen === "dashboard"
              ? "bg-[#e6dfd1] text-primary shadow-xs border border-black/5"
              : "text-on-surface-variant hover:bg-white/40"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Today</span>
        </button>

        {/* Trends (Analytics) */}
        <button
          onClick={() => setActiveScreen("analytics")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-full active:scale-[0.98] transition-all text-left uppercase text-[10px] tracking-widest font-bold ${
            activeScreen === "analytics"
              ? "bg-[#e6dfd1] text-primary shadow-xs border border-black/5"
              : "text-on-surface-variant hover:bg-white/40"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Trends</span>
        </button>

        {/* Manual Log Trigger */}
        <button
          onClick={onOpenManualLog}
          className="flex items-center gap-3 px-3 py-2.5 rounded-full text-on-surface-variant hover:bg-white/40 hover:text-primary transition-all text-left uppercase text-[10px] tracking-widest font-bold"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Manual Log</span>
        </button>

        {/* Categories (Settings) */}
        <button
          onClick={() => setActiveScreen("settings")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-full active:scale-[0.98] transition-all text-left uppercase text-[10px] tracking-widest font-bold ${
            activeScreen === "settings"
              ? "bg-[#e6dfd1] text-primary shadow-xs border border-black/5"
              : "text-on-surface-variant hover:bg-white/40"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categories</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto border-t border-[#c8c8bd]/30 pt-4 flex flex-col gap-1 font-sans">
        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert("Need support? Contact support@flowtracker.io or consult our documentation in settings.");
          }}
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-white/40 hover:text-primary rounded-full transition-colors text-[10px] uppercase tracking-wider font-bold"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support</span>
        </a>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to stop tracking and exit?")) {
              alert("FlowTracker paused. All session times saved safely.");
            }
          }}
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-white/40 hover:text-error rounded-full transition-colors text-[10px] uppercase tracking-wider font-bold text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </nav>
  );
}

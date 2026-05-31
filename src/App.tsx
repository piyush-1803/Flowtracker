import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import HistoryView from "./components/HistoryView";
import AnalyticsView from "./components/AnalyticsView";
import SettingsView from "./components/SettingsView";
import OverrideModal from "./components/OverrideModal";
import { Category, ActivityLog, GeneralPreferences } from "./types";
import { DEFAULT_CATEGORIES, INITIAL_TODAY_LOGS, INITIAL_PREFERENCES, EMPTY_TRENDS, SEEDED_7_DAYS_TRENDS, DayLogAggregate, DEMO_TODAY_LOGS, DEMO_SEEDED_7_DAYS_TRENDS } from "./mockData";
import { initAuth, googleSignIn, logout } from "./firebase";
import { User as FirebaseUser } from "firebase/auth";

export default function App() {
  // Toast notifications state to completely avoid blocking sandboxed browser alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // 1. Navigation & Screens
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "history" | "analytics" | "settings">("dashboard");
  const [dateStr, setDateStr] = useState("Oct 24, 2023");

  // 2. Persistent State with Safe local-storage fallbacks
  const [categories, setCategories] = useState<Category[]>(() => {
    // Check if the update-version clean initialization has run.
    // If not, clear any previous logs and trend caches to ensure a 100% empty initial run.
    const isCleaned = localStorage.getItem("ft_fresh_clean_init_v4");
    if (!isCleaned) {
      localStorage.removeItem("ft_logs");
      localStorage.removeItem("ft_weekly_trends");
      localStorage.setItem("ft_fresh_clean_init_v4", "true");
    }

    const saved = localStorage.getItem("ft_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Initialize as [] for a new user starting fresh by default!
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("ft_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyTrends, setWeeklyTrends] = useState<DayLogAggregate[]>(() => {
    const saved = localStorage.getItem("ft_weekly_trends");
    return saved ? JSON.parse(saved) : EMPTY_TRENDS;
  });

  const [preferences, setPreferences] = useState<GeneralPreferences>(() => {
    const saved = localStorage.getItem("ft_preferences");
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });

  // Google Profile states
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
        setIsAuthLoading(false);
      },
      () => {
        setGoogleUser(null);
        setIsAuthLoading(false);
      }
    );
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        showToast(`Connected: Welcome ${result.user.displayName}!`);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      showToast(`Failed to connect Google profile: ${error.message || "Unknown error"}`);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      showToast("Disconnected: Google profile unlinked.");
    } catch (error: any) {
      console.error("Sign out error:", error);
      showToast("Failed to disconnect Google profile.");
    }
  };

  // Sync state modifications to local-storage
  useEffect(() => {
    localStorage.setItem("ft_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("ft_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("ft_weekly_trends", JSON.stringify(weeklyTrends));
  }, [weeklyTrends]);

  useEffect(() => {
    localStorage.setItem("ft_preferences", JSON.stringify(preferences));
  }, [preferences]);

  // Static Pool of highly immersive developer events for random OS track simulation
  const SIMULATION_EVENTS = [
    { app: "VS Code", title: "src/components/AnalyticsView.tsx", category: "coding", duration: 45 },
    { app: "Google Chrome", title: "Tailwind CSS Layout Guidelines - negative space config", category: "research", duration: 30 },
    { app: "ChatGPT", title: "Explaining system parameters architecture", category: "ai", duration: 40 },
    { app: "Obsidian", title: "Weekly Planning & Goals.md", category: "study", duration: 55 },
    { app: "VS Code", title: "npm run dev - compiler error troubleshooting", category: "coding", duration: 90 },
    { app: "Figma", title: "FlowTracker v2.3 High Fidelity Prototypes", category: "other", duration: 60 },
    { app: "Chrome", title: "AWS Console - Cloud Run routing configurations", category: "research", duration: 35 },
    { app: "Slack", title: "#product-sync - developer team coordination", category: "other", duration: 20 },
    { app: "Spotify", title: "Felt Synth Focus & Ambient loops", category: "other", duration: 15 }
  ];

  // Live Windows Daemon Simulator
  const handleSimulateWindowEvent = () => {
    const randomEvent = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
    
    // Calculate simulated times ending now
    const now = new Date();
    const endingTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const startingTime = new Date(now.getTime() - randomEvent.duration * 60 * 1000);
    const startingTimeStr = startingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Validate if the category exist
    const categoryExists = categories.some(cat => cat.id === randomEvent.category);
    const assignedCatId = categoryExists ? randomEvent.category : (categories[0]?.id || "other");

    const newLog: ActivityLog = {
      id: `sim_log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      application: randomEvent.app,
      title: randomEvent.title,
      startTime: startingTimeStr,
      endTime: endingTimeStr,
      startNum: startingTime.getHours() * 60 + startingTime.getMinutes(),
      endNum: now.getHours() * 60 + now.getMinutes(),
      durationMinutes: randomEvent.duration,
      categoryId: assignedCatId
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast(`Daemon Hooked: Logged focus on "${randomEvent.app}" for ${randomEvent.duration}m.`);
  };

  const handleLoadDemoData = () => {
    setLogs(DEMO_TODAY_LOGS);
    setWeeklyTrends(DEMO_SEEDED_7_DAYS_TRENDS);
    showToast("Sandbox setup: Seeded standard workflow archives & analytics.");
  };

  const handleClearAllData = () => {
    localStorage.removeItem("ft_logs");
    localStorage.removeItem("ft_weekly_trends");
    setLogs([]);
    setWeeklyTrends(EMPTY_TRENDS);
    setSessionSeconds(0);
    showToast("Workspace purged: FlowTracker database was reset to a pristine blank slate.");
  };


  // 3. Dynamic Active Session Counter (Starts empty at 0s for pristine tracker setup)
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // 4. Modal Overrides triggers state
  const [overrideTarget, setOverrideTarget] = useState<ActivityLog | null>(null);
  const [overrideCatId, setOverrideCatId] = useState("");

  const handleOpenOverride = (log: ActivityLog) => {
    setOverrideTarget(log);
    setOverrideCatId(log.categoryId || "coding");
  };

  const handleCloseOverride = () => {
    setOverrideTarget(null);
    setOverrideCatId("");
  };

  const handleSaveOverride = () => {
    if (!overrideTarget) return;

    setLogs((prev) =>
      prev.map((log) =>
        log.id === overrideTarget.id ? { ...log, categoryId: overrideCatId } : log
      )
    );
    handleCloseOverride();
  };

  // Utility Simulation Handlers
  const handleRefresh = () => {
    // Simulate updating active tracking intervals
    const hasUnlabeled = logs.some((l) => l.categoryId === "");
    if (hasUnlabeled) {
      showToast("FlowTracker: Background analysis identified 1 raw pending browser tab interval.");
    } else {
      showToast("FlowTracker: Active session audit complete. All logs fully classified!");
    }
  };

  const handleDownloadReport = () => {
    // Generate simple readable JSON representation
    const exportData = {
      app: "FlowTracker",
      exportedAt: new Date().toISOString(),
      dateReviewed: dateStr,
      categories: categories,
      rawTimeline: logs
    };
    
    // Simulate browser download trigger
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flowtracker_report_${dateStr.replace(/[\s,]+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("FlowTracker: JSON Report successfully exported and downloaded!");
  };

  const handleSavePreferences = () => {
    showToast("Prefs: FlowTracker daemon configurations saved successfully!");
  };

  return (
    <div className="text-on-surface font-sans bg-background flex h-screen overflow-hidden antialiased">
      {/* Sidenav component (Hidden on mobile rails) */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onOpenManualLog={() => setActiveScreen("history")}
        activeSessionDuration={formatSessionDuration(sessionSeconds)}
        googleUser={googleUser}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
      />

      {/* Main workspace section */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          onRefresh={handleRefresh}
          onDownloadReport={handleDownloadReport}
          googleUser={googleUser}
          onLogin={handleGoogleLogin}
          onLogout={handleGoogleLogout}
        />

        {/* Dynamic content router switcher */}
        {activeScreen === "dashboard" && (
          <DashboardView
            categories={categories}
            logs={logs}
            onOpenOverride={handleOpenOverride}
            dateStr={dateStr}
            setDateStr={setDateStr}
            onLoadDemo={handleLoadDemoData}
            onSimulateEvent={handleSimulateWindowEvent}
            googleUser={googleUser}
            onLogin={handleGoogleLogin}
          />
        )}

        {activeScreen === "analytics" && (
          <AnalyticsView 
            categories={categories} 
            logs={logs} 
            dateStr={dateStr}
            weeklyTrends={weeklyTrends}
            setWeeklyTrends={setWeeklyTrends}
          />
        )}

        {activeScreen === "history" && (
          <HistoryView
            categories={categories}
            logs={logs}
            setLogs={setLogs}
            onOpenOverride={handleOpenOverride}
            onSimulateEvent={handleSimulateWindowEvent}
          />
        )}

        {activeScreen === "settings" && (
          <SettingsView
            categories={categories}
            setCategories={setCategories}
            preferences={preferences}
            setPreferences={setPreferences}
            onSave={handleSavePreferences}
            onLoadDemo={handleLoadDemoData}
            onClearAll={handleClearAllData}
            googleUser={googleUser}
            onLogin={handleGoogleLogin}
            onLogout={handleGoogleLogout}
          />
        )}
      </main>

      {/* Dynamic override dialogue overlay */}
      {overrideTarget && (
        <OverrideModal
          log={overrideTarget}
          categories={categories}
          selectedCategoryId={overrideCatId}
          setSelectedCategoryId={setOverrideCatId}
          onClose={handleCloseOverride}
          onSave={handleSaveOverride}
        />
      )}

      {/* Elegant Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d1e10] backdrop-blur-md text-[#fbfafa] text-[10px] font-sans font-bold uppercase tracking-widest px-6 py-4 rounded-full z-[100] shadow-2xl border border-white/5 flex items-center gap-3 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-[#aa804c] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

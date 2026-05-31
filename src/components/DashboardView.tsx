import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Clock, Code, TrendingUp, HelpCircle, MoreHorizontal } from "lucide-react";
import { Category, ActivityLog } from "../types";
import { User as FirebaseUser } from "firebase/auth";

interface DashboardViewProps {
  categories: Category[];
  logs: ActivityLog[];
  onOpenOverride: (log: ActivityLog) => void;
  dateStr: string;
  setDateStr: React.Dispatch<React.SetStateAction<string>>;
  onLoadDemo: () => void;
  onSimulateEvent: () => void;
  googleUser: FirebaseUser | null;
  onLogin: () => void;
}

export default function DashboardView({
  categories,
  logs,
  onOpenOverride,
  dateStr,
  setDateStr,
  onLoadDemo,
  onSimulateEvent,
  googleUser,
  onLogin
}: DashboardViewProps) {
  // We can cycle dates to demo responsive stats manipulation
  const sampleDates = ["Oct 24, 2023", "Oct 25, 2023", "Oct 26, 2023"];
  const handlePrevDate = () => {
    const idx = sampleDates.indexOf(dateStr);
    if (idx > 0) setDateStr(sampleDates[idx - 1]);
    else setDateStr(sampleDates[sampleDates.length - 1]);
  };
  const handleNextDate = () => {
    const idx = sampleDates.indexOf(dateStr);
    if (idx < sampleDates.length - 1) setDateStr(sampleDates[idx + 1]);
    else setDateStr(sampleDates[0]);
  };

  // 1. Calculations from Active State Logs
  const totalLoggedMinutes = logs.reduce((sum, log) => sum + log.durationMinutes, 0);
  
  // Calculate category times
  const categoryMinutesMap: Record<string, number> = {};
  categories.forEach(c => { categoryMinutesMap[c.id] = 0; });
  let uncategorizedMinutes = 0;

  logs.forEach(log => {
    if (log.categoryId && categoryMinutesMap[log.categoryId] !== undefined) {
      categoryMinutesMap[log.categoryId] += log.durationMinutes;
    } else {
      uncategorizedMinutes += log.durationMinutes;
    }
  });

  // Productivity score calculation: Work categories / total logged
  // (Coding and Research count as high-focus productivity: ~90% factor; study is learning: 80%; AI Tools: 100%; Others/Uncategorized: 20%)
  let productivityScoreWeighted = 0;
  if (totalLoggedMinutes > 0) {
    logs.forEach(log => {
      let weight = 0.2; // default
      if (log.categoryId === "coding") weight = 0.95;
      else if (log.categoryId === "research") weight = 0.90;
      else if (log.categoryId === "study") weight = 0.85;
      else if (log.categoryId === "ai") weight = 0.98;
      productivityScoreWeighted += log.durationMinutes * weight;
    });
    productivityScoreWeighted = Math.round((productivityScoreWeighted / totalLoggedMinutes) * 100);
  } else {
    productivityScoreWeighted = 0;
  }

  // Find top category
  let topCatId = "";
  let maxMinutes = -1;
  Object.entries(categoryMinutesMap).forEach(([catId, mins]) => {
    if (mins > maxMinutes) {
      maxMinutes = mins;
      topCatId = catId;
    }
  });
  const topCategory = categories.find(c => c.id === topCatId);
  const topCategoryName = topCategory ? topCategory.name : "None";
  const topCategoryPercent = totalLoggedMinutes > 0 ? Math.round((maxMinutes / totalLoggedMinutes) * 100) : 0;

  // Let's formatting helper for hours and minutes
  const formatHrsMins = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Find first uncategorized log to trigger review
  const firstUncategorizedLog = logs.find(l => !l.categoryId || l.categoryId === "other" || l.categoryId === "");

  // 2. SVG Donut Chart segments calculation
  const radius = 55;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~ 345.57
  
  // Arrange segments
  const chartSegments: {
    id: string;
    name: string;
    color: string;
    minutes: number;
    percent: number;
    strokeLength: number;
    strokeOffset: number;
  }[] = [];

  let accumulatedPercent = 0;
  
  // Add categorised items
  categories.forEach(cat => {
    const mins = categoryMinutesMap[cat.id] || 0;
    if (mins > 0 && totalLoggedMinutes > 0) {
      const p = (mins / totalLoggedMinutes) * 100;
      const length = (mins / totalLoggedMinutes) * circumference;
      const offset = circumference - (accumulatedPercent / 100) * circumference;
      chartSegments.push({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        minutes: mins,
        percent: Math.round(p),
        strokeLength: length,
        strokeOffset: offset
      });
      accumulatedPercent += p;
    }
  });

  // Add uncategorized if > 0
  if (uncategorizedMinutes > 0 && totalLoggedMinutes > 0) {
    const p = (uncategorizedMinutes / totalLoggedMinutes) * 100;
    const length = (uncategorizedMinutes / totalLoggedMinutes) * circumference;
    const offset = circumference - (accumulatedPercent / 100) * circumference;
    chartSegments.push({
      id: "uncategorized",
      name: "Uncategorized",
      color: "#94A3B8", // gray-soft
      minutes: uncategorizedMinutes,
      percent: Math.round(p),
      strokeLength: length,
      strokeOffset: offset
    });
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8 font-sans">
      {/* Date Selector & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-primary opacity-75">Daily Rituals</h1>
          <p className="font-display text-4xl mt-1 italic text-on-surface">
            Good day, {googleUser?.displayName ? googleUser.displayName.split(" ")[0] : "Elena"}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={onSimulateEvent}
            title="Simulate background tracker switch focus"
            className="bg-[#4e654a] hover:bg-[#3d4f3a] text-white rounded-full px-4 py-2.5 flex items-center gap-2 hover:shadow-xs transition-all text-[9px] font-bold uppercase tracking-wider cursor-pointer active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#99e299] animate-pulse"></span>
            Simulate Focus Event
          </button>

          {/* Dynamic Date Picker Control */}
          <div className="flex items-center bg-white/60 border border-black/5 rounded-full p-1.5 shadow-xs">
          <button
            onClick={handlePrevDate}
            className="p-2 hover:bg-[#e6dfd1] rounded-full text-on-surface-variant cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-1 text-xs text-on-surface font-semibold flex items-center gap-2 font-mono">
            <Calendar className="w-3.5 h-3.5 text-primary opacity-70" />
            <span>{dateStr}</span>
          </div>
          <button
            onClick={handleNextDate}
            className="p-2 hover:bg-[#e6dfd1] rounded-full text-on-surface-variant cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Quick Stats Rows (Span 12) */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stat Card 1: Total Logged */}
          <div className="bg-white/60 p-5 rounded-[24px] border border-black/5 shadow-xs hover:bg-white transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60">Total Logged</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="font-display text-2xl font-bold text-on-surface">{formatHrsMins(totalLoggedMinutes)}</div>
            <div className="font-mono text-[10px] text-outline mt-1">+45m vs yesterday</div>
          </div>

          {/* Stat Card 2: Top Category */}
          <div className="bg-white/60 p-5 rounded-[24px] border border-black/5 shadow-xs hover:bg-white transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60">Top Category</span>
              <Code className="w-4 h-4 text-[#4e654a]" />
            </div>
            <div className="font-display text-lg font-bold text-on-surface mt-2 truncate">{topCategoryName}</div>
            <div className="font-mono text-[10px] text-outline mt-1">{topCategoryPercent}% of day</div>
          </div>

          {/* Stat Card 3: Productivity Score */}
          <div className="bg-white/60 p-5 rounded-[24px] border border-black/5 shadow-xs hover:bg-white transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60">Consistency</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="font-display text-2xl font-bold text-on-surface">{productivityScoreWeighted}%</div>
            <div className="w-full bg-[#e6dfd1]/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#4a4a38] h-full rounded-full transition-all duration-500" 
                style={{ width: `${productivityScoreWeighted}%` }}
              ></div>
            </div>
          </div>

          {/* Stat Card 4: Uncategorized */}
          <div className="bg-white/60 p-5 rounded-[24px] border border-black/5 shadow-xs hover:bg-white transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60">Unlabeled Tasks</span>
              <AlertCircle className="w-4 h-4 text-[#7d7a75]" />
            </div>
            <div className="font-display text-2xl font-bold text-on-surface">{formatHrsMins(uncategorizedMinutes)}</div>
            {uncategorizedMinutes > 0 && firstUncategorizedLog ? (
              <button
                onClick={() => onOpenOverride(firstUncategorizedLog)}
                className="mt-1 text-[11px] text-primary italic font-semibold hover:underline text-left cursor-pointer active:scale-95 transition-transform"
              >
                Review now &rarr;
              </button>
            ) : (
              <span className="mt-1 text-[10px] text-[#4e654a] block font-bold uppercase tracking-wider">Perfect flow!</span>
            )}
          </div>
        </div>

        {/* Category Donut Distribution Widget (Span 4) */}
        <div className="col-span-1 md:col-span-4 bg-[#e6dfd1]/75 rounded-[32px] p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2 mb-4">Distribution Flow</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Beautiful Custom SVG Donut Chart */}
            <div className="relative w-44 h-44 mb-4 flex items-center justify-center">
              {totalLoggedMinutes > 0 ? (
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke="#ffffff70"
                    strokeWidth={strokeWidth}
                  />
                  {chartSegments.map((seg, i) => (
                    <circle
                      key={seg.id || i}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={seg.strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out hover:opacity-95 cursor-help"
                      title={`${seg.name}: ${formatHrsMins(seg.minutes)} (${seg.percent}%)`}
                    />
                  ))}
                </svg>
              ) : (
                <div className="w-36 h-36 border-4 border-dashed border-black/10 rounded-full flex items-center justify-center flex-col text-on-surface-variant text-xs p-4 text-center">
                  <span>No log activities</span>
                </div>
              )}

              {/* Inner cutout text overlay */}
              {totalLoggedMinutes > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-[#4a4a38] uppercase tracking-wider font-bold">Total Flow</span>
                  <span className="font-display italic text-xl text-on-surface leading-tight mt-0.5">
                    {formatHrsMins(totalLoggedMinutes)}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Dynamic Legend */}
            <div className="w-full gap-y-2 gap-x-2.5 grid grid-cols-2 text-[10px] px-1 border-t border-black/10 pt-4">
              {chartSegments.map((seg) => (
                <div key={seg.name} className="flex items-center gap-2 overflow-hidden" title={seg.name}>
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: seg.color }}
                  ></div>
                  <span className="text-on-surface truncate pr-0.5 font-bold font-sans tracking-wide leading-none uppercase text-[9px] opacity-80">
                    {seg.name} <span className="opacity-60">({seg.percent}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Horizontal Bar Duration Visualizer (Span 8) */}
        <div className="col-span-1 md:col-span-8 bg-white/60 p-6 rounded-[32px] border border-black/5 shadow-xs flex flex-col">
          <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
            <h3 className="font-display text-lg italic text-on-surface">Weekly Balance</h3>
            <MoreHorizontal className="w-4 h-4 text-[#8a8a80] cursor-pointer hover:text-on-surface" />
          </div>

          {/* Sizable Horizontal Stack */}
          <div className="flex-grow flex flex-col justify-around gap-4 py-1 px-1">
            {categories.map((cat) => {
              const mins = categoryMinutesMap[cat.id] || 0;
              const ratioPercent = totalLoggedMinutes > 0 ? (mins / totalLoggedMinutes) * 100 : 0;
              
              return (
                <div key={cat.id} className="w-full">
                  <div className="flex justify-between items-end mb-1">
                    <span 
                      style={{ 
                        backgroundColor: `${cat.color}15`, 
                        borderColor: `${cat.color}25`,
                        color: cat.color
                      }} 
                      className="px-2.5 py-1 rounded-full text-[9px] font-bold border leading-none uppercase tracking-wider font-sans shrink-0"
                    >
                      {cat.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-on-surface">
                      {formatHrsMins(mins)}
                    </span>
                  </div>

                  {/* Filled track gauge */}
                  <div className="w-full bg-[#efefe9] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        backgroundColor: cat.color,
                        width: `${ratioPercent}%`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Table List (Span 12) */}
        <div className="col-span-1 md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 shadow-xs overflow-hidden mt-2">
          {/* Timeline Table Header */}
          <div className="p-5 px-6 border-b border-black/10 flex justify-between items-center bg-[#e6dfd1]/30">
            <h3 className="font-display text-lg italic text-on-surface">Timeline Stream</h3>
            <span className="text-[9px] text-[#4a4a38] font-sans font-bold uppercase tracking-wider opacity-70">Interactive override tool</span>
          </div>

          {/* Feed List logs */}
          <div className="flex flex-col">
            {logs.length > 0 ? (
              logs.map((log, i) => {
                const matchedCat = categories.find(c => c.id === log.categoryId);
                const colorHex = matchedCat ? matchedCat.color : "#7d7a75"; // default Slate gray for uncategorized
                const catName = matchedCat ? matchedCat.name : "Uncategorized";

                return (
                  <div
                    key={log.id}
                    onClick={() => onOpenOverride(log)}
                    className={`flex items-center justify-between p-4 px-6 border-b border-black/5 hover:bg-white transition-all cursor-pointer group ${
                      i === logs.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      {/* Visual left Indicator bar */}
                      <div 
                        className="w-1.5 h-8 rounded-full transition-all duration-300 group-hover:scale-y-110" 
                        style={{ backgroundColor: colorHex }}
                      ></div>
                      
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-on-surface group-hover:text-[#705d41] transition-colors leading-tight truncate">
                          {log.application} - <span className="font-normal text-on-surface-variant text-xs italic">{log.title}</span>
                        </p>
                        <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                          {log.startTime} - {log.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4 shrink-0">
                      <span 
                        style={{ 
                          backgroundColor: `${colorHex}15`, 
                          borderColor: `${colorHex}25`,
                          color: colorHex
                        }} 
                        className="hidden sm:inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider font-sans"
                      >
                        {catName}
                      </span>
                      <span className="font-mono text-xs font-semibold text-on-surface w-16 text-right">
                        {formatHrsMins(log.durationMinutes)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-16 text-center flex flex-col items-center justify-center gap-4 bg-white/10">
                <div className="w-14 h-14 rounded-full bg-[#efefe9] flex items-center justify-center text-[#4a4a38] animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-[#4a4a38]">Active Workspace is Quiet</h4>
                  <p className="text-xs text-on-surface-variant max-w-md mt-1.5 mx-auto leading-relaxed">
                    FlowTracker daemon is running cleanly without dummy data. Generate real-time simulation tracking events, load sandbox archives, or input manual workflows.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-3 pb-3">
                  <button
                    type="button"
                    onClick={onSimulateEvent}
                    className="bg-[#4e654a] hover:bg-[#3d4f3a] text-white font-bold rounded-full px-5 py-2.5 text-[9px] uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    Generate Simulated Activity
                  </button>
                  <button
                    type="button"
                    onClick={onLoadDemo}
                    className="bg-[#e6dfd1] text-[#4a4a38] hover:bg-[#dcd5c7] font-bold rounded-full px-5 py-2.5 text-[9px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                  >
                    Load Seeded Archives
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

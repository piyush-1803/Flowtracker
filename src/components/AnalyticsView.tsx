import React, { useState } from "react";
import { TrendingUp, CalendarDays, Award, Zap } from "lucide-react";
import { Category, ActivityLog } from "../types";
import { DayLogAggregate } from "../mockData";

interface AnalyticsViewProps {
  categories: Category[];
  logs: ActivityLog[];
  dateStr: string;
  weeklyTrends: DayLogAggregate[];
  setWeeklyTrends: React.Dispatch<React.SetStateAction<DayLogAggregate[]>>;
}

export default function AnalyticsView({ categories, logs, dateStr, weeklyTrends, setWeeklyTrends }: AnalyticsViewProps) {
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  
  // Custom Y axis ranges mapping to daily limit heights: 8h in minutes is 480m
  const yAxisTicks = ["8h", "6h", "4h", "2h", "0h"];
  const maxAxisMinutes = 480; // 8 hours is max limit

  const formatHrsMins = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Determine active day of the week from the current date picker
  const dateObj = new Date(dateStr);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activeDayName = isNaN(dateObj.getTime()) ? "Tue" : dayNames[dateObj.getDay()];

  // Calculate overall user's logs grouped by category
  const logsByCategory: Record<string, number> = {};
  categories.forEach(c => { logsByCategory[c.id] = 0; });
  logs.forEach(log => {
    const catId = log.categoryId || "other";
    if (logsByCategory[catId] !== undefined) {
      logsByCategory[catId] += log.durationMinutes;
    } else {
      logsByCategory["other"] = (logsByCategory["other"] || 0) + log.durationMinutes;
    }
  });

  // Dynamically map or replace activeDayName in the trends dataset
  const dynamicTrends = weeklyTrends.map(dayTrend => {
    if (dayTrend.day === activeDayName) {
      return {
        day: activeDayName,
        categories: { ...logsByCategory }
      };
    }
    return dayTrend;
  });

  // Calculate dynamic weekly summary metrics
  let grandTotalMinutes = 0;
  dynamicTrends.forEach(day => {
    Object.values(day.categories).forEach(m => {
      grandTotalMinutes += m;
    });
  });

  const totalTrackedHours = formatHrsMins(grandTotalMinutes);
  const trendPercent = "+5.2% vs last week"; // Static benchmark representation

  // Focus score based on logs completion percent
  const activeDayMinutes = Object.values(logsByCategory).reduce((sum, m) => sum + m, 0);
  const baseScore = 75;
  const focusBonus = Math.min(Math.floor(activeDayMinutes / 30), 25);
  const focusScore = `${Math.min(baseScore + focusBonus, 100)}/100`;

  const activeDaysCount = dynamicTrends.filter(day => {
    const daySum = Object.values(day.categories).reduce((a, b) => a + b, 0);
    return daySum > 0;
  }).length || 1;
  const averageMinutesPerDay = Math.round(grandTotalMinutes / activeDaysCount);
  const dailyAverageStr = formatHrsMins(averageMinutesPerDay);

  // Calculate overall minutes for Category Split over the 7-day period
  const categorySplitMinutes: Record<string, number> = {};
  categories.forEach(c => { categorySplitMinutes[c.id] = 0; });
  
  dynamicTrends.forEach(day => {
    Object.entries(day.categories).forEach(([catId, mins]) => {
      if (categorySplitMinutes[catId] !== undefined) {
        categorySplitMinutes[catId] += mins;
      } else {
        categorySplitMinutes["other"] = (categorySplitMinutes["other"] || 0) + mins;
      }
    });
  });

  const overallTotalMinutes = Object.values(categorySplitMinutes).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8 bg-surface relative z-0">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        
        {/* Page Header & Controls */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-primary opacity-75">Activity Trends</h1>
            <p className="font-display text-4xl mt-1 italic text-on-surface">Flow Dynamics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const nextRange = selectedRange === "Last 7 Days" ? "Last 14 Days" : "Last 7 Days";
                setSelectedRange(nextRange);
              }}
              className="bg-white/60 border border-black/5 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-white hover:shadow-xs transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer text-on-surface active:scale-95"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#4a4a38]" />
              <span>{selectedRange}</span>
            </button>
          </div>
        </div>

        {/* 12-Column Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* KPI Card 1: Total Tracked */}
          <div className="col-span-1 md:col-span-3 bg-white/60 rounded-[24px] border border-black/5 p-5 shadow-xs hover:shadow-sm transition-all">
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60 mb-1">Total Tracked</p>
            <h3 className="font-mono text-xl font-bold text-on-surface mb-2">{totalTrackedHours}</h3>
            <div className="flex items-center gap-1.5 text-[#4e654a] font-semibold text-[10px] uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{trendPercent}</span>
            </div>
          </div>

          {/* KPI Card 2: Top Focus */}
          <div className="col-span-1 md:col-span-3 bg-white/60 rounded-[24px] border border-black/5 p-5 shadow-xs hover:shadow-sm transition-all">
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60 mb-1">Top Focus</p>
            <h3 className="font-display text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
              Coding
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#7d7a75]">
              <span>18h 30m • 43%</span>
            </div>
          </div>

          {/* KPI Card 3: Focus Score */}
          <div className="col-span-1 md:col-span-3 bg-white/60 rounded-[24px] border border-black/5 p-5 shadow-xs hover:shadow-sm transition-all">
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60 mb-1">Focus Score</p>
            <h3 className="font-mono text-xl font-bold text-on-surface mb-2">{focusScore}</h3>
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#7d7a75]">
              <Zap className="w-3 h-3 text-[#c49a45] shrink-0 fill-[#c49a45]" />
              <span>High session continuity</span>
            </div>
          </div>

          {/* KPI Card 4: Daily Average */}
          <div className="col-span-1 md:col-span-3 bg-white/60 rounded-[24px] border border-black/5 p-5 shadow-xs hover:shadow-sm transition-all">
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant opacity-60 mb-1">Daily Average</p>
            <h3 className="font-mono text-xl font-bold text-on-surface mb-2">{dailyAverageStr}</h3>
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#7d7a75]">
              <Award className="w-3 h-3 text-[#4a4a38] shrink-0" />
              <span>Stable flow rate</span>
            </div>
          </div>

          {/* Main Chart Area: Time Distribution over Time (Span 8) */}
          <div className="col-span-1 md:col-span-8 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs flex flex-col min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-black/10 pb-3 gap-2">
              <h3 className="font-display text-lg italic text-on-surface">Time Distribution</h3>
              
              {/* Dynamic Chart Palette Legend matching colors */}
              <div className="flex flex-wrap gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1.5" title={cat.name}>
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0 cursor-help" 
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Interactive Stacked Column Chart */}
            <div className="flex-1 flex items-end gap-2 pt-6 relative h-64 border-l border-b border-black/15 pb-2">
              
              {/* Y-Axis scale absolute text line */}
              <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-on-surface-variant font-mono text-[9px] pb-6 leading-none opacity-80">
                {yAxisTicks.map((label) => (
                  <span key={label} className="text-right pr-2.5 w-6">{label}</span>
                ))}
              </div>

              {/* Horizontal Grid lines */}
              <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between pb-6 z-0 pointer-events-none opacity-15">
                <div className="border-t border-black w-full h-0"></div>
                <div className="border-t border-black w-full h-0"></div>
                <div className="border-t border-black w-full h-0"></div>
                <div className="border-t border-black w-full h-0"></div>
                <div className="border-b border-black w-full h-0"></div>
              </div>

              {/* Day Bars stacked on top of each other */}
              <div className="flex-1 flex justify-between items-end pl-2 z-10 h-full pb-5">
                {dynamicTrends.map((dayAggregate) => {
                  // Sum total day minutes and build dynamic segments:
                  const totalDayMins = Object.values(dayAggregate.categories).reduce((sum, mins) => sum + mins, 0);

                  // Map through each category and build segments
                  const segments = categories.map((cat) => {
                    const mins = dayAggregate.categories[cat.id] || 0;
                    const percent = (mins / maxAxisMinutes) * 100;
                    return {
                      id: cat.id,
                      name: cat.name,
                      color: cat.color,
                      mins,
                      percent
                    };
                  }).filter(seg => seg.percent > 0);

                  return (
                    <div 
                      key={dayAggregate.day} 
                      className="flex flex-col justify-end w-12 h-full group relative cursor-pointer"
                      title={`${dayAggregate.day} Total: ${formatHrsMins(totalDayMins)}`}
                    >
                      {/* Stack segments dynamically */}
                      {segments.map((seg, sIdx) => (
                        <div 
                          key={seg.id}
                          className={`w-full hover:opacity-80 transition-opacity ${sIdx === segments.length - 1 ? "rounded-t-sm" : ""}`}
                          style={{ 
                            height: `${seg.percent}%`,
                            backgroundColor: seg.color 
                          }}
                        ></div>
                      ))}

                      {/* X-Axis day label */}
                      <div className="absolute -bottom-6 left-0 right-0 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-[#4a4a38] opacity-80 py-1">
                        {dayAggregate.day}
                      </div>

                      {/* Hover Tooltip card popup */}
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#2d2d2a] text-white rounded-lg p-3 text-[10px] font-sans shadow-md hidden group-hover:block z-30 min-w-36 leading-normal pointer-events-none">
                        <p className="font-bold border-b border-white/20 pb-1 mb-1 font-display italic text-sm">{dayAggregate.day}</p>
                        {segments.map(seg => (
                          <p key={seg.id} className="flex justify-between gap-4">
                            <span className="truncate max-w-[80px]">{seg.name}:</span> 
                            <span>{seg.mins}m</span>
                          </p>
                        ))}
                        {segments.length === 0 && (
                          <p className="italic text-neutral-400">No activity today</p>
                        )}
                        <p className="border-t border-white/15 pt-1 mt-1 font-bold flex justify-between text-neutral-300">
                          <span>Total:</span> <span>{formatHrsMins(totalDayMins)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[9px] text-[#4a4a38] uppercase tracking-wider font-bold opacity-60 text-right mt-5">Values represent logged periods up to 8-hour tracking limits</p>
          </div>

          {/* Historical Category split breakdown meter (Span 4) */}
          <div className="col-span-1 md:col-span-4 bg-[#e6dfd1]/75 rounded-[32px] p-6 shadow-xs flex flex-col min-h-[400px]">
            <h3 className="font-display text-lg italic text-on-surface mb-6 border-b border-black/10 pb-2">Category Split</h3>
            
            <div className="flex-grow flex flex-col justify-center gap-5">
              {categories.map((cat) => {
                const totalMins = categorySplitMinutes[cat.id] || 0;
                const ratioPercent = overallTotalMinutes > 0 ? Math.round((totalMins / overallTotalMinutes) * 100) : 0;

                return (
                  <div key={cat.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: cat.color }}
                        ></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface truncate leading-none">{cat.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-on-surface">
                        {formatHrsMins(totalMins)}
                      </span>
                    </div>

                    {/* Progress slider bar indicator */}
                    <div className="w-full bg-[#ffffff60] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
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
        </div>

      </div>
    </div>
  );
}

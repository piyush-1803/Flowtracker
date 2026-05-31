import React, { useState } from "react";
import { ListFilter, Search, Clock, Plus, Tag, HelpCircle, Trash2 } from "lucide-react";
import { Category, ActivityLog } from "../types";

interface HistoryViewProps {
  categories: Category[];
  logs: ActivityLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenOverride: (log: ActivityLog) => void;
  onSimulateEvent?: () => void;
}

export default function HistoryView({
  categories,
  logs,
  setLogs,
  onOpenOverride,
  onSimulateEvent
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");

  // Inline "Add Manual Log" Form helper states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formApp, setFormApp] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formStart, setFormStart] = useState("09:00 AM");
  const [formEnd, setFormEnd] = useState("10:00 AM");
  const [formDuration, setFormDuration] = useState(60);
  const [formCategory, setFormCategory] = useState(categories[0]?.id || "coding");

  // Filter computation
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.application.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCatFilter === "all" || log.categoryId === selectedCatFilter;

    return matchesSearch && matchesCategory;
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formApp.trim() || !formTitle.trim()) return;

    const newLog: ActivityLog = {
      id: `manual_log_${Date.now()}`,
      application: formApp.trim(),
      title: formTitle.trim(),
      startTime: formStart,
      endTime: formEnd,
      startNum: 540, // standard offset placeholder
      endNum: 600,
      durationMinutes: Number(formDuration),
      categoryId: formCategory
    };

    setLogs([newLog, ...logs]);
    
    // Reset Form
    setFormApp("");
    setFormTitle("");
    setFormDuration(60);
    setShowAddForm(false);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      setLogs(logs.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-primary opacity-75">Workflow Archives</h1>
            <p className="font-display text-4xl mt-1 italic text-on-surface">Time Logs History</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="self-start sm:self-auto bg-[#4a4a38] text-white hover:bg-[#5a5a40] font-bold rounded-full px-6 py-3 text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Entry</span>
          </button>
        </div>

        {/* Form panel for manually appending logged items */}
        {showAddForm && (
          <form 
            onSubmit={handleManualAdd}
            className="bg-white/70 p-6 rounded-[32px] border border-black/5 shadow-xs animate-fadeIn flex flex-col gap-6"
          >
            <h3 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2">Add Manual Workflow Session</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Application / Program</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VS Code, Chrome, Slack"
                  value={formApp}
                  onChange={(e) => setFormApp(e.target.value)}
                  className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Window Title / File context</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. index.html, StackOverflow.com"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Time parameters (Start - End)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    placeholder="09:00 AM"
                    className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl font-mono"
                  />
                  <input
                    type="text"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    placeholder="10:00 AM"
                    className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Duration (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="bg-[#fafaf6] border border-black/10 p-3 text-xs text-on-surface rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-black/10 rounded-full text-on-surface hover:bg-neutral-100 text-[10px] uppercase tracking-wider font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#4a4a38] text-white rounded-full font-bold text-[10px] uppercase tracking-wider cursor-pointer active:scale-95"
              >
                Log Session
              </button>
            </div>
          </form>
        )}

        {/* Filter Toolbar Area */}
        <div className="bg-white/60 p-4 rounded-[24px] border border-black/5 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Custom Quick search input field */}
          <div className="flex-1 relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-4 top-3 text-[#7d7a75]" />
            <input
              type="text"
              placeholder="Search by keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#efefe9]/60 border border-black/5 text-xs text-on-surface rounded-[16px] pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#4a4a38] focus:bg-white transition-all"
            />
          </div>

          {/* Selector filter choice dropdown */}
          <div className="flex items-center gap-2 max-sm:w-full shrink-0">
            <ListFilter className="w-3.5 h-3.5 text-[#7d7a75]" />
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-[#fafaf6] shadow-xs border border-black/10 text-[10px] uppercase tracking-wider font-bold text-on-surface rounded-[16px] p-2 px-3 pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4a4a38] max-sm:w-full"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="">Uncategorized</option>
            </select>
          </div>
        </div>

        {/* Chronological Grid Table Log */}
        <div className="bg-white/60 rounded-[32px] border border-black/5 shadow-xs overflow-hidden min-h-[300px]">
          {filteredLogs.length > 0 ? (
            <div className="flex flex-col">
              {filteredLogs.map((log) => {
                const matchedCat = categories.find((c) => c.id === log.categoryId);
                const colorHex = matchedCat ? matchedCat.color : "#7d7a75";
                const catName = matchedCat ? matchedCat.name : "Uncategorized";

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 px-6 border-b border-black/5 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-4 overflow-hidden flex-1 select-none">
                      <div 
                        className="w-1.5 h-8 rounded-full shrink-0" 
                        style={{ backgroundColor: colorHex }}
                      ></div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-on-surface group-hover:text-[#705d41] transition-colors leading-tight truncate select-text">
                          {log.application}
                        </p>
                        <p className="text-xs text-on-surface-variant italic truncate mt-0.5 select-text">
                          {log.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-mono text-xs font-semibold text-on-surface">
                        {log.startTime} - {log.endTime}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => onOpenOverride(log)}
                        style={{ borderColor: `${colorHex}25`, backgroundColor: `${colorHex}15`, color: colorHex }}
                        className="hidden md:inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold border hover:opacity-85 cursor-pointer max-w-[100px] truncate uppercase tracking-wider font-sans"
                      >
                        {catName}
                      </button>

                      <span className="font-mono text-xs font-semibold text-on-surface w-12 text-right">
                        {log.durationMinutes}m
                      </span>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-on-surface-variant hover:text-red-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center text-outline">
              <Clock className="w-10 h-10 mb-4 text-[#7d7a75] opacity-40" />
              <p className="text-sm font-semibold text-on-surface">No tracked database entries found</p>
              <p className="text-[11px] mt-1.5 max-w-sm mx-auto text-on-surface-variant">
                You can add a manual focus work session using the button above, or trigger background switch events inside the sandbox.
              </p>
              {onSimulateEvent && (
                <button
                  type="button"
                  onClick={onSimulateEvent}
                  className="mt-5 bg-[#4e654a] hover:bg-[#3d4f3a] text-white font-bold rounded-full px-5 py-2 text-[9px] uppercase tracking-wider transition-colors active:scale-95 shadow-xs cursor-pointer"
                >
                  Generate Simulated Task Log
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

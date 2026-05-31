import { X, Sliders, Terminal, Check } from "lucide-react";
import { Category, ActivityLog } from "../types";

interface OverrideModalProps {
  log: ActivityLog;
  categories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function OverrideModal({
  log,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  onClose,
  onSave
}: OverrideModalProps) {
  return (
    <div className="fixed inset-0 bg-[#4a4a38]/40 backdrop-blur-[6px] flex items-center justify-center p-4 z-50 animate-fadeIn">
      {/* Dialog Window */}
      <div className="bg-white/95 w-full max-w-[480px] rounded-[32px] shadow-2xl border border-black/5 overflow-hidden flex flex-col transform transition-all animate-scaleUp">
        
        {/* Header toolbar */}
        <div className="px-6 py-5 border-b border-black/5 bg-[#fafaf6] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#4a4a38] shrink-0" />
            <h2 className="font-display text-lg italic text-[#4a4a38] tracking-tight">Manual Override</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-black hover:bg-neutral-100 rounded-full p-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Current Activity details target card */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.15em] font-sans font-bold text-on-surface-variant opacity-75">
              Current Activity Target
            </label>
            <div className="flex items-center gap-3 bg-[#fafaf6] p-4 rounded-2xl border border-black/5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#4a4a38]/10 flex items-center justify-center text-[#4a4a38] shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-sm font-semibold text-on-surface truncate">{log.application}</span>
                <span className="font-mono text-[10px] text-on-surface-variant truncate mt-0.5 opacity-80">
                  {log.title}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Radio Assigner Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.15em] font-sans font-bold text-on-surface-variant opacity-75">
              Assign To Category
            </label>
            
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    style={{
                      borderColor: isSelected ? cat.color : undefined,
                      backgroundColor: isSelected ? `${cat.color}10` : undefined,
                      boxShadow: isSelected ? `0 2px 8px ${cat.color}15` : undefined
                    }}
                    className={`relative flex items-center gap-2.5 p-3 px-4 rounded-xl border text-left cursor-pointer transition-all uppercase text-[9px] tracking-wider font-bold ${
                      isSelected
                        ? "text-slate-900 border-2"
                        : "border-black/10 hover:bg-[#fafaf6] text-on-surface-variant"
                    }`}
                  >
                    {/* Visual Check / Custom Dot */}
                    <div 
                      style={{ 
                        backgroundColor: isSelected ? cat.color : "transparent",
                        borderColor: isSelected ? cat.color : "#d1cfc7" 
                      }}
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0"
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    
                    <span 
                      style={{ color: isSelected ? cat.color : undefined }}
                      className="truncate"
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Triggers footer */}
        <div className="px-6 py-4 border-t border-black/5 bg-[#fafaf6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-black/10 text-[10px] font-bold uppercase tracking-wider text-on-surface rounded-full hover:bg-neutral-100 bg-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#4a4a38] text-white font-bold text-[10px] uppercase tracking-wider rounded-full border border-transparent shadow-sm hover:bg-[#5a5a40] transition-colors cursor-pointer active:scale-95"
          >
            Save Override
          </button>
        </div>

      </div>
    </div>
  );
}

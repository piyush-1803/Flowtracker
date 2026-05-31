import React, { useState } from "react";
import { Sliders, Key, Tag, Plus, Edit2, Trash2, Save, Eye, EyeOff, Check, X, Database } from "lucide-react";
import { Category, GeneralPreferences } from "../types";
import { User as FirebaseUser } from "firebase/auth";

interface SettingsViewProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  preferences: GeneralPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<GeneralPreferences>>;
  onSave: () => void;
  onLoadDemo?: () => void;
  onClearAll?: () => void;
  googleUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function SettingsView({
  categories,
  setCategories,
  preferences,
  setPreferences,
  onSave,
  onLoadDemo,
  onClearAll,
  googleUser,
  onLogin,
  onLogout
}: SettingsViewProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Category management helper states
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#8B5CF6");
  const [newCatType, setNewCatType] = useState("Work");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");

  // Handler for adding a category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Generate valid color, random id
    const id = newCatName.toLowerCase().replace(/\s+/g, "-");
    const newCat: Category = {
      id: id,
      name: newCatName.trim(),
      color: newCatColor,
      type: newCatType
    };

    setCategories([...categories, newCat]);
    
    // Reset helper form states
    setNewCatName("");
    setNewCatColor("#3B82F6");
    setNewCatType("Work");
    setIsAddingNew(false);
  };

  // Handler for saving edits
  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, name: editingName.trim(), color: editingColor } : c
      )
    );
    setEditingId(null);
  };

  // Handler for deleting a category
  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert("At least one tracking category must exist.");
      return;
    }
    if (confirm(`Are you sure you want to delete the category "${id}"? All associated logged tasks will default to Uncategorized.`)) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingColor(cat.color);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Banner Header */}
        <header>
          <h1 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-primary opacity-75">Control Panel</h1>
          <p className="font-display text-4xl mt-1 italic text-on-surface">Configuration Settings</p>
        </header>
 
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* General Preferences Card */}
          <div className="md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs">
            <h2 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2.5 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4a4a38]" />
              <span>General Preferences</span>
            </h2>
 
            <div className="flex flex-col gap-5">
              {/* Start on Boot Toggle Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-on-surface font-semibold">Start on Boot</h3>
                  <p className="text-xs text-on-surface-variant">Automatically launch FlowTracker when Windows starts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.startOnBoot}
                    onChange={(e) => setPreferences({ ...preferences, startOnBoot: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#efefe9] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#4a4a38] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a4a38]"></div>
                </label>
              </div>
 
              {/* Daily Categorization Time selection */}
              <div className="grid grid-cols-1 gap-1.5 pt-2">
                <label className="text-sm text-on-surface font-semibold" htmlFor="categorization_time">
                  Daily Categorization Time
                </label>
                <p className="text-xs text-on-surface-variant mb-2">Set the time when AI auto-categorizes unlabeled activities.</p>
                <input
                  type="time"
                  id="categorization_time"
                  name="categorization_time"
                  value={preferences.dailyCategorizationTime}
                  onChange={(e) => setPreferences({ ...preferences, dailyCategorizationTime: e.target.value })}
                  className="w-full md:w-52 bg-[#fafaf6] border border-black/10 text-on-surface text-xs font-mono font-medium rounded-xl focus:ring-primary focus:border-primary block p-3 transition-colors focus:outline-none"
                />
              </div>
            </div>
          </div>
 
          {/* AI Integrations Card with API Security */}
          <div className="md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs">
            <h2 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2.5 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#4a4a38]" />
              <span>AI Integrations</span>
            </h2>
 
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-on-surface font-semibold" htmlFor="api_key">
                Claude API Key
              </label>
              <p className="text-xs text-on-surface-variant mb-2">Required for intelligent automatic activity classification.</p>
              
              {/* Sensitive credential entry with lazy visual eye control */}
              <div className="relative w-full max-w-lg">
                <input
                  type={showApiKey ? "text" : "password"}
                  id="api_key"
                  className="w-full bg-[#fafaf6] border border-black/10 text-on-surface font-mono text-xs rounded-xl focus:ring-[#4a4a38] block p-3 pr-10 transition-colors focus:outline-none"
                  placeholder="sk-ant-api03-..."
                  value={preferences.apiKey}
                  onChange={(e) => setPreferences({ ...preferences, apiKey: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
 
          {/* Fully Interactive Category Management Card */}
          <div className="md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs">
            <div className="flex justify-between items-center border-b border-black/10 pb-2.5 mb-4">
              <h2 className="font-display text-lg italic text-on-surface flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#4a4a38]" />
                <span>Manage Categories</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="bg-[#4a4a38] text-white hover:bg-[#5a5a40] font-bold rounded-full px-4 py-2 text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Category</span>
              </button>
            </div>
 
            <div className="flex flex-col gap-3">
              
              {/* Expandable inline Add form if enabled */}
              {isAddingNew && (
                <form 
                  onSubmit={handleAddCategory} 
                  className="p-4 bg-[#e6dfd1]/35 border border-[#c8c8bd] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fadeIn mb-2"
                >
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Color:</span>
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-8 h-8 rounded-full border border-black/10 cursor-pointer"
                    />
                  </div>
 
                  <input
                    type="text"
                    required
                    maxLength={20}
                    placeholder="e.g. Design, Exercise"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-white border border-black/10 p-2 px-3 text-xs text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4a4a38] w-full sm:w-auto"
                  />
 
                  <select
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                    className="bg-white border border-black/10 p-2 text-xs text-on-surface rounded-xl focus:outline-none w-full sm:w-auto font-bold text-[10px] uppercase tracking-wider"
                  >
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Misc">Misc</option>
                    <option value="Personal">Personal</option>
                  </select>
 
                  <div className="flex gap-1.5 justify-end w-full sm:w-auto sm:ml-auto">
                    <button
                      type="submit"
                      className="p-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 cursor-pointer"
                      title="Confirm adding category"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="p-2 bg-neutral-500 text-white rounded-full hover:bg-neutral-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
 
              {/* Render dynamic customizable rows */}
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
 
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 px-5 border border-black/5 hover:bg-white transition-colors rounded-2xl bg-white/40"
                  >
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      {isEditing ? (
                        <>
                          <input
                            type="color"
                            value={editingColor}
                            onChange={(e) => setEditingColor(e.target.value)}
                            className="w-7 h-7 rounded-full border border-black/10 cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            maxLength={22}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="bg-white border border-black/10 px-3 py-1 text-xs text-on-surface rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#4a4a38] w-full max-w-[180px]"
                          />
                        </>
                      ) : (
                        <>
                          {/* Colored dot representation */}
                          <div
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          <span className="text-xs text-on-surface font-semibold truncate">
                            {cat.name}
                          </span>
                          <span 
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                            className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full leading-none shrink-0 border border-[currentColor]/10"
                          >
                            {cat.type}
                          </span>
                        </>
                      )}
                    </div>
 
                    {/* Operational controls */}
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat.id)}
                            className="text-emerald-700 hover:text-emerald-900 p-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-neutral-500 hover:text-neutral-800 p-1.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditCategory(cat)}
                            className="text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-neutral-100 rounded-full cursor-pointer"
                            title={`Edit ${cat.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-on-surface-variant hover:text-red-700 transition-colors p-1.5 hover:bg-neutral-100 rounded-full cursor-pointer"
                            title={`Delete ${cat.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Google Account Profile Card */}
          <div className="md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs">
            <h2 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2.5 mb-4 flex items-center gap-2">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Google Profile Sync Status</span>
            </h2>
            {googleUser ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/40 border border-black/5 rounded-[24px] p-5">
                <div className="flex items-center gap-4">
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      referrerPolicy="no-referrer"
                      alt={googleUser.displayName || "Google avatar"}
                      className="w-14 h-14 rounded-full object-cover border border-[#4a4a38]/20 shadow-xs animate-fadeIn"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#4a4a38] text-white flex items-center justify-center font-bold text-lg font-sans">
                      {googleUser.displayName?.substring(0, 2).toUpperCase() || "YK"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on-surface">{googleUser.displayName || "Google User"}</p>
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-emerald-200">
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{googleUser.email}</p>
                    <p className="text-[10px] text-stone-500 font-mono mt-1.5">
                      Approved Scopes: profile, email
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200 rounded-full px-5 py-2.5 text-[9px] uppercase tracking-widest transition-all cursor-pointer active:scale-95"
                >
                  Unlink Profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#fbfbf9] border border-dotted border-[#4a4a38]/20 rounded-[24px] p-5">
                <div className="max-w-md">
                  <p className="text-xs font-bold text-[#4a4a38] uppercase tracking-wider mb-1">Separate Google Account Integration</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Connect your separate Google Account to enable custom session syncing, dynamic client headers, personalized dashboard greets, and profile picture synchronization across widgets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="bg-[#4a4a38] text-white hover:bg-[#323225] font-bold rounded-full px-5 py-3 text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5 animate-pulse">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>Link Google Account</span>
                </button>
              </div>
            )}
          </div>
 
          {/* Fully Interactive Sandbox Controls Card */}
          {onLoadDemo && onClearAll && (
            <div className="md:col-span-12 bg-white/60 rounded-[32px] border border-black/5 p-6 shadow-xs">
              <h2 className="font-display text-lg italic text-on-surface border-b border-black/10 pb-2.5 mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4a4a38]" />
                <span>Simulation & Onboarding Sandbox</span>
              </h2>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Configure your tracking session space. You can purge the active database to test FlowTracker as a brand new user starting entirely fresh, or instantly incorporate seeded archives for quick trend chart lookup.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="bg-[#4e654a] hover:bg-[#3d4f3a] text-white font-bold rounded-full px-5 py-2.5 text-[10px] uppercase tracking-wider transition-colors cursor-pointer active:scale-95 shadow-xs"
                >
                  Load Sandbox Demo Dataset
                </button>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="bg-red-700/80 hover:bg-red-800 text-white font-bold rounded-full px-5 py-2.5 text-[10px] uppercase tracking-wider transition-colors cursor-pointer active:scale-95 shadow-xs"
                >
                  Reset Database (Factory Reset)
                </button>
              </div>
            </div>
          )}

        </div>
 
        {/* Dynamic Save Action Area */}
        <div className="flex justify-end pt-5 border-t border-black/10 mt-3">
          <button
            type="button"
            onClick={onSave}
            className="bg-[#4a4a38] text-white hover:bg-[#5a5a40] font-bold rounded-full px-6 py-3 text-[10px] uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
 
      </div>
    </div>
  );
}

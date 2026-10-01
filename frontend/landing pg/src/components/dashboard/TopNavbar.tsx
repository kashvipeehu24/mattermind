import React from 'react';
import { SearchBar } from './SearchBar';
import { NotificationMenu } from './NotificationMenu';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Sparkles, Menu, Activity, ShieldCheck } from 'lucide-react';
import { MaterialItem, AIAlert } from '../../types';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAiAssistant: () => void;
  onToggleMobileSidebar: () => void;
  onSelectMaterial?: (material: MaterialItem) => void;
  onSelectAlert?: (alert: AIAlert) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAiAssistant,
  onToggleMobileSidebar,
  onSelectMaterial,
  onSelectAlert
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-slate-900 font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            MatterMind Intelligence
          </span>
          <span>/</span>
          <span className="truncate">Enterprise Dashboard</span>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-xl">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onSelectMaterial={onSelectMaterial}
        />
      </div>

      {/* Right: Quick Tools, AI Trigger, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Node Health Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Nodes Synced</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-mono">99.98%</span>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAiAssistant}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>AI Assistant</span>
        </button>

        {/* Notifications */}
        <NotificationMenu onSelectAlert={onSelectAlert} />

        {/* User Profile Dropdown */}
        <div className="pl-1 border-l border-slate-200">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

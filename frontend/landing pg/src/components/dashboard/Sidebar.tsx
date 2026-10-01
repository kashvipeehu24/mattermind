import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  LineChart,
  Grid2x2Check,
  ShieldCheck,
  Leaf,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Cpu,
  Bot
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unresolvedAlertCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  unresolvedAlertCount,
  mobileOpen,
  onCloseMobile
}) => {
  const navItems = [
    { path: '/', label: 'Dashboard Home', icon: LayoutDashboard },
    { path: '/materials', label: 'Material Catalog & Passports', icon: Database, badge: '8 Batch' },
    { path: '/analytics', label: 'Predictive Useful Life (RUL)', icon: LineChart },
    { path: '/compatibility', label: 'Compatibility Matrix', icon: Grid2x2Check },
    { path: '/provenance', label: 'Blockchain Provenance', icon: ShieldCheck, badge: 'Immutable' },
    { path: '/sustainability', label: 'Sustainability & Carbon', icon: Leaf, badge: '-18.4% CO₂' },
    { path: '/alerts', label: 'AI Alerts Center', icon: BellRing, alertCount: unresolvedAlertCount },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0 shadow-md">
            <Layers className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
                MatterMind
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-secondary/30 text-secondary border border-secondary/40">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Material Intelligence v4.8</span>
            </div>
          )}
        </div>

        {/* Collapse toggle button for desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Enterprise Node Context */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-secondary" /> ACTIVE R&D NODE
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-xs font-bold text-white truncate">Siemens Energy & Aerospace</p>
          <p className="text-[10px] text-slate-400">Node ID: DE-MUN-VAULT-04</p>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />

              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}

              {item.alertCount !== undefined && item.alertCount > 0 && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isCollapsed
                      ? 'absolute top-1 right-1'
                      : ''
                  } bg-rose-500 text-white animate-pulse`}
                >
                  {item.alertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick AI Assistant Card Footer */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 text-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-secondary/20 text-secondary">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Neural Material Copilot</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Ask AI to predict multi-alloy stress fatigue or generate EU DPP certificates.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash
            </span>
            <span className="font-mono">v4.8.2</span>
          </div>
        </div>
      )}

      {/* Footer / Copyright */}
      {!isCollapsed && (
        <div className="p-3 text-center border-t border-slate-800 text-[10px] text-slate-500">
          MatterMind Enterprise Platform © 2026
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 z-30 transition-all duration-300" style={{ width: isCollapsed ? '4rem' : '16rem' }}>
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};

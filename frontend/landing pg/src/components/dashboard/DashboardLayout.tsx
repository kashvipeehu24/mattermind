import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MaterialPassportDrawer } from './MaterialPassportDrawer';
import { AIQuickAssistant } from './AIQuickAssistant';
import { MaterialItem, AIAlert } from '../../types';
import { AlertTriangle, Info, RefreshCw, Settings, CheckCircle2 } from 'lucide-react';

interface DashboardLayoutProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unresolvedAlertCount: number;
  selectedMaterial: MaterialItem | null;
  onSelectMaterial: (m: MaterialItem | null) => void;
  dataSource?: 'live' | 'demo' | 'empty';
  apiError?: string | null;
  onRetrySync?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  searchQuery,
  onSearchChange,
  unresolvedAlertCount,
  selectedMaterial,
  onSelectMaterial,
  dataSource = 'demo',
  apiError = null,
  onRetrySync
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          unresolvedAlertCount={unresolvedAlertCount}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            onSelectMaterial={(mat) => onSelectMaterial(mat)}
            onSelectAlert={() => {}}
          />

          {/* Explicit Data Source & Backend Sync Status Banner */}
          {!isBannerDismissed && dataSource !== 'live' && (
            <div className={`px-4 sm:px-6 py-2.5 text-xs border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
              apiError
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-center gap-2">
                {apiError ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                )}
                <span>
                  <strong>{apiError ? 'Backend Sync Notice: ' : 'Demo Baseline Mode: '}</strong>
                  {apiError ? (
                    <span>{apiError} — Displaying curated baseline dataset.</span>
                  ) : (
                    <span>Viewing curated baseline R&D dataset. Sign in with backend credentials for live database synchronization.</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {onRetrySync && (
                  <button
                    onClick={onRetrySync}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Sync
                  </button>
                )}
                <Link
                  to="/settings"
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Settings className="w-3 h-3" /> Diagnostics
                </Link>
                <button
                  onClick={() => setIsBannerDismissed(true)}
                  className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  title="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Page View Container */}
          <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">MatterMind Enterprise Platform</span>
              <span>•</span>
              <span>Siemens & Autodesk R&D Node</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                EU DPP Ledger Node Online
              </span>
              <span>ISO 14040 Certified</span>
              <span>Governance & Privacy</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Slide-over Drawer for Material Passport */}
      <MaterialPassportDrawer
        material={selectedMaterial}
        onClose={() => onSelectMaterial(null)}
      />

      {/* AI Material Assistant Modal */}
      <AIQuickAssistant
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

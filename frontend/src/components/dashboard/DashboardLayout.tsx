import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MaterialPassportDrawer } from './MaterialPassportDrawer';
import { AIQuickAssistant } from './AIQuickAssistant';
import { MaterialItem, AIAlert } from '../types';

interface DashboardLayoutProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unresolvedAlertCount: number;
  selectedMaterial: MaterialItem | null;
  onSelectMaterial: (m: MaterialItem | null) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  searchQuery,
  onSearchChange,
  unresolvedAlertCount,
  selectedMaterial,
  onSelectMaterial
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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
            onSelectAlert={(alert) => {
              // Could trigger alert modal or filter
            }}
          />

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

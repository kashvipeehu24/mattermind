import React, { useState } from 'react';
import { MaterialItem } from '../../types';
import { MaterialTable } from '../../components/dashboard/MaterialTable';
import { StatCard } from '../../components/dashboard/StatCard';
import { PassportBadge, BlockchainBadge } from '../../components/dashboard/StatusBadges';
import { MaterialRegistrationModal } from '../../components/dashboard/MaterialRegistrationModal';
import { Database, FileCheck, ShieldCheck, Filter, Plus, Download, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

interface MaterialCatalogProps {
  materials: MaterialItem[];
  onSelectMaterial: (m: MaterialItem) => void;
  onAddMaterial?: (m: MaterialItem) => void;
  dataSource?: 'live' | 'demo' | 'empty';
  apiError?: string | null;
  onRetrySync?: () => void;
}

export const MaterialCatalog: React.FC<MaterialCatalogProps> = ({
  materials,
  onSelectMaterial,
  onAddMaterial,
  dataSource = 'demo',
  apiError = null,
  onRetrySync,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const activeSpecs = materials.filter(m => m.status === 'Active Spec').length;
  const inTesting = materials.filter(m => m.status === 'Testing Phase').length;
  const quarantined = materials.filter(m => m.status === 'Quarantined').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Digital Product Passport (DPP) Catalog</h1>
            {dataSource === 'live' ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Backend Sync
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Curated Demo Baseline
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized repository for high-entropy metals, composites, bio-polymers, and semiconductors compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetrySync && dataSource !== 'live' && (
            <button
              onClick={onRetrySync}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync DB
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register Batch Spec
          </button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Query Notice:</strong> {apiError}. Showing {materials.length} curated baseline reference specifications.
            </span>
          </div>
          {onRetrySync && (
            <button
              onClick={onRetrySync}
              className="px-2.5 py-1 rounded bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold text-[11px] shrink-0 transition-colors"
            >
              Retry Live Query
            </button>
          )}
        </div>
      )}

      {/* Catalog KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Material Batches"
          value={materials.length}
          unit="Active Batches"
          change="+2 New This Month"
          isPositive={true}
          subtitle="Aerospace & R&D Specs"
          icon={Database}
        />

        <StatCard
          title="Active Commercial Specs"
          value={activeSpecs}
          unit="Certified"
          change="Flight Critical"
          isPositive={true}
          subtitle="Ready for manufacturing"
          icon={FileCheck}
          variant="accent"
        />

        <StatCard
          title="Testing & R&D Phase"
          value={inTesting}
          unit="In Pilot"
          change="Sintering Furnace"
          isPositive={true}
          subtitle="Micro-grain optimization"
          icon={Sparkles}
        />

        <StatCard
          title="Quarantined Isolation"
          value={quarantined}
          unit="Isolated"
          change="Action Required"
          isPositive={false}
          subtitle="Micro-fracture detected"
          icon={ShieldCheck}
          variant="dark"
        />
      </div>

      {/* Material Data Table */}
      <MaterialTable
        materials={materials}
        onSelectMaterial={onSelectMaterial}
        title="Comprehensive Digital Product Passport Database"
      />

      {/* Registration Modal Dialog */}
      <MaterialRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMaterialCreated={(newMat) => {
          onAddMaterial?.(newMat);
        }}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { MaterialItem } from '../types';
import { MaterialTable } from '../components/MaterialTable';
import { StatCard } from '../components/StatCard';
import { PassportBadge, BlockchainBadge } from '../components/StatusBadges';
import { Database, FileCheck, ShieldCheck, Filter, Plus, Download, Sparkles } from 'lucide-react';

interface MaterialCatalogProps {
  materials: MaterialItem[];
  onSelectMaterial: (m: MaterialItem) => void;
}

export const MaterialCatalog: React.FC<MaterialCatalogProps> = ({
  materials,
  onSelectMaterial
}) => {
  const [filterCat, setFilterCat] = useState('All');

  const activeSpecs = materials.filter(m => m.status === 'Active Spec').length;
  const inTesting = materials.filter(m => m.status === 'Testing Phase').length;
  const quarantined = materials.filter(m => m.status === 'Quarantined').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Digital Product Passport (DPP) Catalog</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized repository for high-entropy metals, composites, bio-polymers, and semiconductors compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert('Simulating addition of new batch specification into EU DPP Ledger...')}
            className="px-4 py-2 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Register Batch Spec
          </button>
        </div>
      </div>

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
    </div>
  );
};

import React from 'react';
import { MaterialItem } from '../types';
import { HealthBadge, BlockchainBadge, PassportBadge, SeverityBadge } from './StatusBadges';
import {
  X,
  FileCheck,
  ShieldCheck,
  Cpu,
  Layers,
  Leaf,
  Clock,
  ExternalLink,
  Download,
  Share2,
  AlertTriangle,
  Sparkles,
  Award,
  Factory
} from 'lucide-react';

interface MaterialPassportDrawerProps {
  material: MaterialItem | null;
  onClose: () => void;
}

export const MaterialPassportDrawer: React.FC<MaterialPassportDrawerProps> = ({
  material,
  onClose
}) => {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-secondary-fixed">
                  {material.code}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {material.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white truncate max-w-md">
                {material.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Health Index</span>
              <div className="mt-1">
                <HealthBadge score={material.healthIndex} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Passport Status</span>
              <div className="mt-1">
                <PassportBadge status={material.passportStatus} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ledger Verification</span>
              <div className="mt-1">
                <BlockchainBadge verified={material.blockchainVerified} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Recyclability</span>
              <div className="mt-1 font-bold text-emerald-700 text-sm">
                Grade {material.recyclabilityGrade}
              </div>
            </div>
          </div>

          {/* Digital Product Passport Overview Card */}
          <div className="p-4 rounded-xl border border-secondary/30 bg-gradient-to-r from-secondary/5 to-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> EU Digital Product Passport (DPP)
              </span>
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {material.passportId}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              This passport contains cryptographically verifiable lifecycle data, chemical provenance, and scope 1-3 carbon metrics in compliance with EU ESPR (Ecodesign for Sustainable Products Regulation) standards.
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/60 text-slate-500">
              <span>Issuer: <strong className="text-slate-800">European Material Intelligence Agency (EMIA)</strong></span>
              <span>Audit Date: <strong className="text-slate-800">{material.lastTestedDate}</strong></span>
            </div>
          </div>

          {/* Chemical & Micro-Structure Specification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-slate-700" /> Chemical & Micro-Structure Specification
            </h3>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Elemental Composition Formula</span>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 font-bold tracking-wide">
                  {material.composition}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Density</span>
                  <span className="font-bold text-slate-900">{material.densityGcm3} g/cm³</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Tensile Strength</span>
                  <span className="font-bold text-slate-900">{material.tensileStrengthMpa} MPa</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Thermal Cond.</span>
                  <span className="font-bold text-slate-900">{material.thermalConductivity} W/m·K</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Embodied CO₂</span>
                  <span className="font-bold text-emerald-600">{material.embodiedCarbonKgCo2} kg/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Useful Life & Predictive Stress AI */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-secondary" /> Neural Stress & Remaining Useful Life (RUL)
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Predicted Useful Life</span>
                  <div className="text-2xl font-black text-white">{material.remainingUsefulLifeYears} Years</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Compatibility Index</span>
                  <div className="text-2xl font-black text-secondary-fixed">{material.compatibilityScore}/100</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block mb-1">AI Diagnostics Summary:</span>
                {material.notes}
              </div>
            </div>
          </div>

          {/* Blockchain Provenance Chain */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700" /> Immutable Ledger Provenance
            </h3>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cryptographic Block Hash:</span>
                <span className="font-mono text-[11px] text-secondary font-semibold truncate max-w-[220px]">
                  {material.blockchainHash}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supplier / Foundry:</span>
                <span className="font-bold text-slate-900">{material.supplier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Batch Control Number:</span>
                <span className="font-mono text-slate-900">{material.batchNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Physical Vault Location:</span>
                <span className="font-medium text-slate-800">{material.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => alert(`Downloading signed EU Digital Product Passport certificate for ${material.code}...`)}
            className="flex-1 h-11 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Signed Passport (PDF)
          </button>

          <button
            onClick={() => alert(`Copied share link for ${material.passportId} to clipboard!`)}
            className="h-11 px-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share DPP
          </button>
        </div>
      </div>
    </div>
  );
};

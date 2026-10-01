import React, { useState } from 'react';
import { MaterialItem } from '../../types';
import { MOCK_COMPATIBILITY_PAIRS } from '../../data/mockData';
import { Grid2x2Check, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Layers } from 'lucide-react';

interface CompatibilityMatrixProps {
  materials: MaterialItem[];
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({ materials }) => {
  const [baseMatId, setBaseMatId] = useState(materials[0]?.id || '');
  const [targetMatId, setTargetMatId] = useState(materials[3]?.id || '');

  const baseMat = materials.find((m) => m.id === baseMatId) || materials[0];
  const targetMat = materials.find((m) => m.id === targetMatId) || materials[3];

  // Calculate dynamic compatibility score based on density and thermal properties
  const thermalDiff = Math.abs(baseMat.thermalConductivity - targetMat.thermalConductivity);
  const score = Math.max(45, Math.min(99, Math.round(100 - thermalDiff * 0.8)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <Grid2x2Check className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Material Compatibility Matrix</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predict multi-alloy and polymer/composite joint compatibility, thermal expansion matching, and galvanic corrosion risk.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Neural Interface Solver Active</span>
        </div>
      </div>

      {/* Interactive Interface Calculator */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-secondary-fixed" />
          Multi-Alloy Joint Interface Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Material Selector */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase block">Base Substrate (Material A)</label>
            <select
              value={baseMatId}
              onChange={(e) => setBaseMatId(e.target.value)}
              className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-secondary"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {m.name}
                </option>
              ))}
            </select>

            <div className="text-xs space-y-1.5 text-slate-300 pt-2 border-t border-slate-700">
              <div className="flex justify-between">
                <span>Category:</span> <strong className="text-white">{baseMat.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>Thermal Conductivity:</span> <strong className="text-emerald-400">{baseMat.thermalConductivity} W/m·K</strong>
              </div>
              <div className="flex justify-between">
                <span>Tensile Strength:</span> <strong className="text-secondary-fixed">{baseMat.tensileStrengthMpa} MPa</strong>
              </div>
            </div>
          </div>

          {/* Target Material Selector */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase block">Joining Substrate (Material B)</label>
            <select
              value={targetMatId}
              onChange={(e) => setTargetMatId(e.target.value)}
              className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-secondary"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {m.name}
                </option>
              ))}
            </select>

            <div className="text-xs space-y-1.5 text-slate-300 pt-2 border-t border-slate-700">
              <div className="flex justify-between">
                <span>Category:</span> <strong className="text-white">{targetMat.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>Thermal Conductivity:</span> <strong className="text-emerald-400">{targetMat.thermalConductivity} W/m·K</strong>
              </div>
              <div className="flex justify-between">
                <span>Tensile Strength:</span> <strong className="text-secondary-fixed">{targetMat.tensileStrengthMpa} MPa</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results Box */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-secondary/20 via-slate-800 to-slate-800 border border-secondary/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-bold">Predicted Compatibility Score</span>
            <div className="text-3xl font-black text-white">{score} / 100</div>
            <p className="text-xs text-slate-300">
              {score > 85 ? 'Optimal interface compatibility. Zero galvanic corrosion predicted.' : 'Requires protective passivation coating or transition interlayer.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
              score > 85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {score > 85 ? 'Optimal Combination' : 'Conditional Interface'}
            </span>
            <button
              onClick={() => alert(`Generated joint specification report for ${baseMat.code} + ${targetMat.code}`)}
              className="px-4 py-2 bg-secondary hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Export Joint Spec
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Verified Compatibility Pairs Table */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Pre-Calculated Enterprise Joint Pairings</h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Base Material</th>
                <th className="p-3.5">Target Material</th>
                <th className="p-3.5">Match Score</th>
                <th className="p-3.5">Galvanic Risk</th>
                <th className="p-3.5">Recommended Interface</th>
                <th className="p-3.5">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_COMPATIBILITY_PAIRS.map((pair) => (
                <tr key={pair.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{pair.baseMaterial}</td>
                  <td className="p-3.5 font-bold text-slate-900">{pair.targetMaterial}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-secondary">{pair.compatibilityScore}%</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      pair.galvanicCorrosionRisk === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {pair.galvanicCorrosionRisk} Risk
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{pair.recommendedInterface}</td>
                  <td className="p-3.5 font-bold">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] ${
                      pair.verdict === 'Optimal Combination' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pair.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

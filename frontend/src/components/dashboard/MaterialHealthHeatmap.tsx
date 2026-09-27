import React from 'react';
import { MaterialItem } from '../types';
import { Sparkles, Grid3X3, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MaterialHealthHeatmapProps {
  materials: MaterialItem[];
  onSelectMaterial?: (material: MaterialItem) => void;
}

export const MaterialHealthHeatmap: React.FC<MaterialHealthHeatmapProps> = ({
  materials,
  onSelectMaterial
}) => {
  // Stress Vector mock metrics generated deterministically from material attributes
  const vectors = [
    { key: 'thermal', label: 'Thermal Fatigue' },
    { key: 'tensile', label: 'Tensile Stress' },
    { key: 'galvanic', label: 'Galvanic Fit' },
    { key: 'lattice', label: 'Lattice Defect' },
    { key: 'outgassing', label: 'Outgassing' },
    { key: 'recyclability', label: 'Circular Rate' }
  ];

  const getVectorScore = (m: MaterialItem, vectorKey: string): number => {
    switch (vectorKey) {
      case 'thermal':
        return Math.min(99, Math.max(50, Math.round(m.healthIndex * 0.98)));
      case 'tensile':
        return Math.min(99, Math.max(55, Math.round(m.compatibilityScore)));
      case 'galvanic':
        return Math.min(99, Math.max(48, Math.round(m.healthIndex * 0.95 + 2)));
      case 'lattice':
        return Math.min(99, Math.max(60, Math.round(m.healthIndex)));
      case 'outgassing':
        return Math.min(99, Math.max(65, Math.round((m.remainingUsefulLifeYears / 30) * 100)));
      case 'recyclability':
        return m.recyclabilityGrade === 'A+' ? 98 : m.recyclabilityGrade === 'A' ? 88 : m.recyclabilityGrade === 'B' ? 75 : 45;
      default:
        return 85;
    }
  };

  const getColorClass = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/15 text-emerald-700 border-emerald-300 font-bold';
    if (score >= 80) return 'bg-blue-500/15 text-blue-700 border-blue-300 font-bold';
    if (score >= 70) return 'bg-amber-500/15 text-amber-700 border-amber-300 font-bold';
    return 'bg-rose-500/15 text-rose-700 border-rose-300 font-bold animate-pulse';
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <Grid3X3 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Material Health & Micro-Stress Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-dimensional neural stress matrix assessing micro-structure health across critical operating envelopes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> &gt;90% Optimal</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> 80-89% Certified</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> 70-79% Warning</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> &lt;70% Critical</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Material Spec</th>
              {vectors.map((v) => (
                <th key={v.key} className="p-3 text-center">
                  {v.label}
                </th>
              ))}
              <th className="p-3 text-center">Overall Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {materials.map((m) => (
              <tr
                key={m.id}
                onClick={() => onSelectMaterial && onSelectMaterial(m)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="p-3 font-bold font-sans">
                  <div className="font-mono text-secondary group-hover:underline text-xs">{m.code}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate max-w-[150px]">{m.name}</div>
                </td>

                {vectors.map((v) => {
                  const score = getVectorScore(m, v.key);
                  return (
                    <td key={v.key} className="p-2 text-center">
                      <div className={`px-2 py-1 rounded border ${getColorClass(score)}`}>
                        {score}%
                      </div>
                    </td>
                  );
                })}

                <td className="p-2 text-center">
                  <div className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold">
                    {m.healthIndex}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

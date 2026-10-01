import React, { useState } from 'react';
import { MaterialItem } from '../../types';
import { ChartCard } from '../../components/dashboard/ChartCard';
import { StatCard } from '../../components/dashboard/StatCard';
import { MOCK_CHART_DEGRADATION } from '../../data/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { LineChart as LineChartIcon, Activity, Sparkles, Cpu, ShieldAlert, Download, RefreshCw } from 'lucide-react';

interface PredictiveAnalyticsProps {
  materials: MaterialItem[];
  onSelectMaterial: (m: MaterialItem) => void;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  materials,
  onSelectMaterial
}) => {
  const [cycles, setCycles] = useState('10000');
  const [selectedMaterialCode, setSelectedMaterialCode] = useState('Ti-6Al-4V-ELI');

  const selectedMat = materials.find(m => m.code === selectedMaterialCode) || materials[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary text-white">
              <LineChartIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Predictive Remaining Useful Life (RUL) & Stress Fatigue</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Neural physics simulation estimating lattice dislocation rates and yield strength decay under cyclic stress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Running neural multi-physics simulation across all material batches...')}
            className="px-4 py-2 bg-secondary hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Run Neural Simulation
          </button>
        </div>
      </div>

      {/* RUL Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Predicted Lifespan"
          value="15.4 Yrs"
          unit="Flight Hours: 45,000"
          change="+1.8 Yrs Target"
          isPositive={true}
          subtitle="Zero-failure safety margin"
          icon={LineChartIcon}
          variant="accent"
        />

        <StatCard
          title="Lattice Micro-Creep Rate"
          value="0.002%"
          unit="per 1,000 hrs"
          change="Safe Threshold"
          isPositive={true}
          subtitle="Synchrotron X-Ray verified"
          icon={Activity}
        />

        <StatCard
          title="Thermal Shock Margin"
          value="+320°C"
          unit="Cryogenic to Hot"
          change="Optimal"
          isPositive={true}
          subtitle="Exceeds Boeing Spec"
          icon={Cpu}
        />

        <StatCard
          title="Critical Fatigue Alert"
          value="1 Batch"
          unit="UHTC Ceramic"
          change="Micro-fracture"
          isPositive={false}
          subtitle="Isolated in Vault 4"
          icon={ShieldAlert}
          variant="dark"
        />
      </div>

      {/* Main RUL Simulation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Lattice Structural Integrity vs Stress Cycles (0 - 10,000 Cycles)"
          subtitle="Comparative decay curve across Titanium, Nickel Superalloy, Cantor HEA, and Ceramic Matrix."
          badgeText="Finite Element Model (FEM)"
          actionButtonText="Export FEM Model"
          onAction={() => alert('Exporting Finite Element Model mesh in STEP format...')}
          className="lg:col-span-2"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DEGRADATION} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="cycle" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="ti64" name="Ti-6Al-4V" stroke="#316bf3" strokeWidth={3} />
                <Line type="monotone" dataKey="inconel" name="Inconel-718" stroke="#10b981" strokeWidth={2.5} />
                <Line type="monotone" dataKey="hea" name="Cantor HEA" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="uhtc" name="UHTC Ceramic" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Selected Material Deep Diagnostics Panel */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Batch Stress Inspection</h3>
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
              Neural AI v4.8
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Select Material Batch</label>
            <select
              value={selectedMaterialCode}
              onChange={(e) => setSelectedMaterialCode(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.code}>
                  {m.code} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Health Index</span>
              <span className="text-xl font-bold text-emerald-400">{selectedMat.healthIndex}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Predicted RUL</span>
              <span className="text-xl font-bold text-white">{selectedMat.remainingUsefulLifeYears} Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Tensile Strength</span>
              <span className="text-sm font-mono text-secondary-fixed">{selectedMat.tensileStrengthMpa} MPa</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
            <strong className="text-slate-900">AI Recommendation:</strong> {selectedMat.notes}
          </p>

          <button
            onClick={() => onSelectMaterial(selectedMat)}
            className="w-full py-2.5 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl transition-colors"
          >
            Inspect Full Digital Passport (DPP)
          </button>
        </div>
      </div>
    </div>
  );
};

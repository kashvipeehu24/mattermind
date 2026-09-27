import React from 'react';
import { MaterialItem } from '../types';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { MOCK_SUSTAINABILITY, MOCK_CHART_CARBON_TREND } from '../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { Leaf, Award, Download, CheckCircle2, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface SustainabilityESGProps {
  materials: MaterialItem[];
}

export const SustainabilityESG: React.FC<SustainabilityESGProps> = ({ materials }) => {
  const totalSavings = materials.reduce((acc, curr) => acc + curr.carbonSavingsKg, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-slate-900 font-bold">
              <Leaf className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Sustainability & Carbon Intelligence (Scope 1-3)</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Auditing embodied carbon footprint, recycled material content, and circular economy compliance under ISO 14040.
          </p>
        </div>

        <button
          onClick={() => alert('Generating official ESG Scope 1-3 Compliance Audit Report PDF...')}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          Export ESG Audit Report
        </button>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_SUSTAINABILITY.map((m) => (
          <StatCard
            key={m.id}
            title={m.title}
            value={m.value}
            change={m.change}
            isPositive={m.isPositive}
            subtitle={m.subtitle}
            icon={Leaf}
            variant={m.id === 'sust-01' ? 'dark' : 'light'}
          />
        ))}
      </div>

      {/* Carbon Reduction Trend + Recyclability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Monthly Carbon Offset Savings (Metric Tons CO₂e)"
          subtitle="Cumulative greenhouse gas reductions across aerospace alloy and bio-polymer R&D batches."
          badgeText="Scope 3 Target Met"
          actionButtonText="Download CSV"
          onAction={() => alert('Exporting monthly carbon offset CSV...')}
          className="lg:col-span-2"
        >
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_CARBON_TREND} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="savings" name="Actual CO2 Savings (Tons)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target (Tons)" fill="#316bf3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Circular Economy & Recyclability Grades */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Recyclability Grade Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Grade A+ (100% Circular / Bio)</span>
                <span className="text-emerald-600">4 Batches (50%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Grade A (Highly Recyclable Alloy)</span>
                <span className="text-blue-600">3 Batches (37.5%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[37.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Grade B/C (Specialized Process)</span>
                <span className="text-amber-600">1 Batch (12.5%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[12.5%]" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">ISCC PLUS & ISO 14040 Certified:</span>
            <p>
              MatterMind intelligence platform verifies raw feedstock sustainability from foundry to final component lifecycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { ChartCard } from '../../components/dashboard/ChartCard';
import { MaterialTable } from '../../components/dashboard/MaterialTable';
import { MaterialHealthHeatmap } from '../../components/dashboard/MaterialHealthHeatmap';
import { SeverityBadge, BlockchainBadge } from '../../components/dashboard/StatusBadges';
import { MaterialItem, AIAlert } from '../types';
import {
  MOCK_CHART_DEGRADATION,
  MOCK_CHART_CARBON_TREND,
  MOCK_CHART_CATEGORIES,
  MOCK_CHART_COMPATIBILITY_DISTRIBUTION,
  MOCK_ALERTS,
  MOCK_ACTIVITIES
} from '../../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ShieldCheck,
  FileCheck,
  Leaf,
  BellRing,
  Clock,
  ArrowRight,
  Sparkles,
  Grid2x2Check,
  CheckCircle2,
  Recycle
} from 'lucide-react';

interface DashboardHomeProps {
  materials: MaterialItem[];
  onSelectMaterial: (m: MaterialItem) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  materials,
  onSelectMaterial
}) => {
  const [alerts, setAlerts] = useState<AIAlert[]>(MOCK_ALERTS);

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  };

  // Aggregate Metrics for KPIs
  const avgRUL = (
    materials.reduce((acc, curr) => acc + curr.remainingUsefulLifeYears, 0) / materials.length
  ).toFixed(1);

  const avgCompatibility = Math.round(
    materials.reduce((acc, curr) => acc + curr.compatibilityScore, 0) / materials.length
  );

  const totalCarbonSavings = materials.reduce((acc, curr) => acc + curr.carbonSavingsKg, 0);
  const activePassportsCount = materials.filter(
    (m) => m.passportStatus === 'compliant' || m.passportStatus === 'certified'
  ).length;
  const verifiedLedgerCount = materials.filter((m) => m.blockchainVerified).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Headline Banner - Clear Product Identity */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/30 text-secondary border border-secondary/40 uppercase tracking-widest">
                MATTERMIND™ PLATFORM
              </span>
              <span className="text-xs text-slate-400 font-mono">Siemens & Autodesk R&D Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Enterprise Material Intelligence & Lifecycle Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time neural fatigue prognosis, multi-alloy interface compatibility, and EU Digital Product Passport (DPP) compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Inferences Today</span>
              <span className="text-lg font-black text-emerald-400 font-mono">1,482</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Ledger Sync Status</span>
              <span className="text-lg font-black text-secondary font-mono">100% Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Core KPI Cards explicitly requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Active Material Passports */}
        <StatCard
          title="Active Material Passports"
          value={`${activePassportsCount} / ${materials.length}`}
          unit="EU DPP Ready"
          change="100% Compliant"
          isPositive={true}
          subtitle="Ecodesign Regulation 2026"
          icon={FileCheck}
          variant="accent"
        />

        {/* 2. AI Compatibility Score */}
        <StatCard
          title="AI Compatibility Score"
          value={`${avgCompatibility} / 100`}
          unit="Multi-Alloy Match"
          change="Galvanic Fit"
          isPositive={true}
          subtitle="Joint interface tolerance"
          icon={Grid2x2Check}
        />

        {/* 3. Remaining Useful Life Prediction */}
        <StatCard
          title="Remaining Useful Life Prediction"
          value={`${avgRUL} Yrs`}
          unit="Avg RUL"
          change="+2.1 Yrs"
          isPositive={true}
          subtitle="Predictive thermal fatigue"
          icon={Clock}
        />

        {/* 4. Blockchain Verified Materials */}
        <StatCard
          title="Blockchain Verified Materials"
          value={`${verifiedLedgerCount} / ${materials.length}`}
          unit="Verified Nodes"
          change="100% Intact"
          isPositive={true}
          subtitle="SHA256 Cryptographic Block"
          icon={ShieldCheck}
        />

        {/* 5. Carbon Saved */}
        <StatCard
          title="Carbon Saved"
          value={`${(totalCarbonSavings / 1000).toFixed(1)} T`}
          unit="Metric Tons CO₂e"
          change="-18.4% YoY"
          isPositive={true}
          subtitle="Vs virgin metal baseline"
          icon={Leaf}
          variant="dark"
        />

        {/* 6. Circular Reuse Opportunities */}
        <StatCard
          title="Circular Reuse Opportunities"
          value="84.6%"
          unit="Feedstock Rate"
          change="+6.2% Target"
          isPositive={true}
          subtitle="ISCC PLUS Certified"
          icon={Recycle}
        />
      </div>

      {/* Professional Analytics Area */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Material Lifecycle Trend */}
          <ChartCard
            title="Material Lifecycle Trend"
            subtitle="Predictive lattice degradation rate across 10,000 thermal-mechanical stress cycles."
            badgeText="Neural Prognosis Engine"
            actionButtonText="Export Data"
            onAction={() => alert('Exporting lifecycle trend CSV...')}
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DEGRADATION} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="cycle" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="ti64" name="Ti-6Al-4V Titanium" stroke="#316bf3" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="inconel" name="Inconel-718 AM" stroke="#10b981" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="hea" name="High-Entropy Alloy" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="uhtc" name="UHTC Ceramic (Critical)" stroke="#f43f5e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Titanium Grade 23</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Inconel 718</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cantor HEA</span>
              </div>
              <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Synchrotron Validated
              </span>
            </div>
          </ChartCard>

          {/* 2. Material Category Distribution */}
          <ChartCard
            title="Material Category Distribution"
            subtitle="Proportional breakdown of R&D material batches across core high-performance domains."
            badgeText="8 Active Batches"
          >
            <div className="h-64 w-full pt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CHART_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {MOCK_CHART_CATEGORIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs text-slate-700 font-medium">{value}</span>}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* 3. AI Compatibility Distribution */}
          <ChartCard
            title="AI Compatibility Distribution"
            subtitle="Multi-alloy and polymer joint interface compatibility rating across active testing matrix."
            badgeText="Interface Solver"
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_COMPATIBILITY_DISTRIBUTION} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" name="Pairings Count" radius={[6, 6, 0, 0]}>
                    {MOCK_CHART_COMPATIBILITY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <span>Overall Joint Compatibility Index: <strong className="text-secondary">89 / 100</strong></span>
              <span className="text-slate-500">Zero Galvanic Corrosion Predicted</span>
            </div>
          </ChartCard>

          {/* 4. Sustainability Score Trend */}
          <ChartCard
            title="Sustainability Score Trend"
            subtitle="Monthly greenhouse gas reductions and carbon offset metrics vs enterprise targets."
            badgeText="Scope 1-3 ISO 14040"
            actionButtonText="ESG Audit"
            onAction={() => alert('Generating ESG Audit Certificate PDF...')}
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_CARBON_TREND} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavingsHome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="savings" name="CO₂ Savings (Tons)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavingsHome)" />
                  <Line type="monotone" dataKey="target" name="Monthly Target" stroke="#316bf3" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <span>Total Cumulative Carbon Savings: <strong className="text-emerald-600">17,810 Metric Tons</strong></span>
              <span className="text-emerald-600 font-bold">100% Target Attainment</span>
            </div>
          </ChartCard>
        </div>

        {/* 5. Material Health Heatmap */}
        <MaterialHealthHeatmap materials={materials} onSelectMaterial={onSelectMaterial} />
      </div>

      {/* Main Bottom Section: Recent Materials Table + Right Panel (AI Alerts + Recent Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Materials Table */}
        <div className="lg:col-span-2 space-y-6">
          <MaterialTable
            materials={materials}
            onSelectMaterial={onSelectMaterial}
            title="Recent Materials & Batch Telemetries"
          />
        </div>

        {/* Right Column (1 Col): AI Alerts Panel + Recent Activity Timeline */}
        <div className="space-y-6">
          {/* AI Alerts Panel */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Anomaly Alerts Panel</h3>
                  <p className="text-[11px] text-slate-500">Real-time micro-fracture & compliance</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                {alerts.filter((a) => a.status !== 'resolved').length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100 space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`pt-3 space-y-1.5 p-2.5 rounded-xl transition-all ${
                    alert.status === 'resolved' ? 'opacity-50 bg-slate-50' : 'bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate max-w-[160px]">
                      {alert.title}
                    </span>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span className="font-mono text-slate-700 font-semibold">{alert.materialName}</span>
                    <span>{alert.timestamp}</span>
                  </div>

                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="w-full mt-1.5 py-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => (window.location.hash = '#/alerts')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Incident Command Hub
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Activity Timeline</h3>
                  <p className="text-[11px] text-slate-500">Immutable ledger events</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Sync</span>
            </div>

            <div className="divide-y divide-slate-100 space-y-2.5 max-h-[300px] overflow-y-auto">
              {MOCK_ACTIVITIES.map((act) => (
                <div key={act.id} className="pt-2 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{act.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{act.action}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-secondary font-medium">{act.targetMaterial}</span>
                    <span className="font-mono text-slate-400">{act.hash}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Signed with Hardware HSM</span>
              <span className="text-emerald-600 font-bold">100% Cryptographic Audit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MOCK_ALERTS } from '../../data/mockData';
import { AIAlert, AlertSeverity } from '../../types';
import { SeverityBadge } from '../../components/dashboard/StatusBadges';
import { BellRing, ShieldAlert, AlertTriangle, CheckCircle2, Sparkles, Filter, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

export const AIAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AIAlert[]>(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unresolved') return a.status !== 'resolved';
    return a.severity === activeTab;
  });

  const unresolvedCount = alerts.filter((a) => a.status !== 'resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500 text-white">
              <BellRing className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Incident Command & AI Anomaly Center</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Severity-graded intelligent anomalies, micro-fracture alerts, thermal fatigue warnings, and supply chain recalls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> {unresolvedCount} Active Incidents
          </span>
        </div>
      </div>

      {/* Alert Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl w-fit text-xs font-semibold">
        {['all', 'unresolved', 'critical', 'warning', 'info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg capitalize transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts Grid / List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No incidents found for the selected filter tab. All neural nodes reporting clean telemetries.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.status === 'resolved'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : alert.severity === 'critical'
                  ? 'bg-rose-50/40 border-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-xs font-bold text-slate-900">{alert.materialName}</span>
                    <span className="text-[10px] font-mono text-slate-400">• {alert.timestamp}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{alert.description}</p>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs space-y-1">
                    <span className="text-slate-900 font-bold block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-secondary" /> Recommended AI Intervention:
                    </span>
                    <p className="text-slate-600">{alert.actionRecommendation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  {alert.status !== 'resolved' ? (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

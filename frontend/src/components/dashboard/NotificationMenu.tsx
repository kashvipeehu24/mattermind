import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, Sparkles, Check, ExternalLink, Filter } from 'lucide-react';
import { MOCK_ALERTS } from '../data/mockData';
import { AIAlert, AlertSeverity } from '../types';

interface NotificationMenuProps {
  onSelectAlert?: (alert: AIAlert) => void;
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({ onSelectAlert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AIAlert[]>(MOCK_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const unresolvedCount = alerts.filter(a => a.status !== 'resolved').length;

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, status: 'resolved' as const })));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
        title="AI Alerts & System Notifications"
      >
        <Bell className="w-5 h-5" />
        {unresolvedCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unresolvedCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Intelligence Alerts</h3>
                  <p className="text-[11px] text-slate-500">{unresolvedCount} active anomaly warnings</p>
                </div>
              </div>

              {unresolvedCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-secondary hover:underline font-medium flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>

            {/* Severity Filter pills */}
            <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1 pr-1">
                <Filter className="w-3 h-3" />
              </span>
              {['all', 'critical', 'warning', 'info'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-0.5 rounded-full capitalize font-medium transition-colors ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Alert Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No alerts matching the selected severity.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (onSelectAlert) onSelectAlert(alert);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      alert.status === 'unresolved' ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {alert.severity === 'critical' ? (
                        <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </div>
                      ) : alert.severity === 'warning' ? (
                        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {alert.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {alert.category}
                          </span>
                          <span className="text-[10px] font-semibold text-secondary flex items-center gap-0.5">
                            Investigate <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium">
                Connected to Real-time Neural Telemetry Engine v4.8
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

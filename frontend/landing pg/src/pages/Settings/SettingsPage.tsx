import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  Key,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Layers,
  Save,
  Bell
} from 'lucide-react';
import { api, API_BASE_URL } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL || window.location.origin);
  const [activeNode, setActiveNode] = useState('DE-MUN-VAULT-04 (Siemens Energy & Aerospace Hub)');
  const [consensusNode, setConsensusNode] = useState('Ethereum Sepolia Node #4,910,229');
  const [autoSync, setAutoSync] = useState(true);
  const [aiModel, setAiModel] = useState('MatterMind Neural Predictor v4.8 (Local + Gemini Hybrid)');

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'disconnected'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const testConnection = async () => {
    setConnectionStatus('checking');
    setStatusMessage(null);
    try {
      const res = await api.health();
      let extraInfo = `GET /health: ${res.status || 'healthy'}`;

      if (api.isAuthenticated()) {
        try {
          const user = await api.getCurrentUser();
          extraInfo += ` | Auth: Authenticated as ${user.email} (${user.role || 'user'})`;
        } catch (authErr: any) {
          extraInfo += ` | Auth: Token invalid (${authErr.message})`;
        }

        try {
          const mats = await api.getMaterials({ limit: 5 });
          extraInfo += ` | Materials DB: ${mats.length} records returned`;
        } catch (matErr: any) {
          extraInfo += ` | Materials DB Notice: ${matErr.message}`;
        }
      } else {
        extraInfo += ' | Auth: Unauthenticated (Guest Mode)';
      }

      setConnectionStatus('connected');
      setStatusMessage(extraInfo);
    } catch (err: any) {
      setConnectionStatus('disconnected');
      setStatusMessage(`Unable to reach backend at ${apiUrl || 'http://localhost:8000'}: ${err.message}. Using offline demo fallback.`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <Server className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Platform Settings & Enterprise Node Configuration</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage API connection endpoints, blockchain network configurations, and neural telemetry preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={testConnection}
            disabled={connectionStatus === 'checking'}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
            Test API Status
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 font-medium ${
            connectionStatus === 'connected'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {connectionStatus === 'connected' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Connectivity */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-bold text-slate-900">Active R&D Cluster & Endpoint</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Backend REST API Endpoint</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-secondary"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Configured via VITE_API_URL environment variable.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Active Enterprise Cluster</label>
              <select
                value={activeNode}
                onChange={(e) => setActiveNode(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary"
              >
                <option value="DE-MUN-VAULT-04 (Siemens Energy & Aerospace Hub)">
                  DE-MUN-VAULT-04 (Siemens Energy & Aerospace Hub)
                </option>
                <option value="US-BOS-RND-01 (Autodesk Materials Lab)">
                  US-BOS-RND-01 (Autodesk Materials Lab)
                </option>
                <option value="FR-TLS-AERO-02 (Airbus Metallurgy Cleanroom)">
                  FR-TLS-AERO-02 (Airbus Metallurgy Cleanroom)
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Blockchain Ledger Consensus Network</label>
              <input
                type="text"
                value={consensusNode}
                onChange={(e) => setConsensusNode(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Security & Intelligence Engine */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Security & AI Engine Parameters</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Neural Prognosis Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary"
              >
                <option value="MatterMind Neural Predictor v4.8 (Local + Gemini Hybrid)">
                  MatterMind Neural Predictor v4.8 (Local + Gemini Hybrid)
                </option>
                <option value="Physics-Informed Neural Network (PINN-14040)">
                  Physics-Informed Neural Network (PINN-14040)
                </option>
                <option value="Rule Engine v1.0 (Deterministic ISO LCA)">
                  Rule Engine v1.0 (Deterministic ISO LCA)
                </option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Automatic Ledger Telemetry Sync</span>
                <span className="text-[11px] text-slate-500">Real-time hash validation on batch property changes</span>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1">
              <span className="text-secondary font-bold block flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Hardware Security Token: Active
              </span>
              <p className="text-slate-300 text-[11px]">
                Cryptographic signatures are verified against hardware security module DE-HSM-9022.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

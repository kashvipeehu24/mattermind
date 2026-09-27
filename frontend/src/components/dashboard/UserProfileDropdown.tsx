import React, { useState } from 'react';
import { Shield, ChevronDown, Key, Server, Lock, LogOut, CheckCircle2, UserCheck } from 'lucide-react';

export const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [workspace, setWorkspace] = useState('Siemens Energy & Aerospace Hub');

  const workspaces = [
    'Siemens Energy & Aerospace Hub',
    'Autodesk R&D Advanced Materials Lab',
    'Palantir Foundry Defense Node',
    'Airbus Cleanroom Metallurgy Vault'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200">
            HV
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-bold text-slate-900 leading-none">Dr. Helena Vance</div>
          <div className="text-[10px] text-slate-500 leading-none mt-1">Chief Material Scientist</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Profile Header */}
            <div className="p-4 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-white font-bold text-sm flex items-center justify-center">
                  HV
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    Dr. Helena Vance
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-300">helena.vance@mattermind.ai</div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Security L4 Admin
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Hardware Token Active
                </span>
              </div>
            </div>

            {/* Workspace Switcher */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Active Enterprise Workspace
              </label>
              <div className="space-y-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => setWorkspace(ws)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      workspace === ws
                        ? 'bg-secondary text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <span className="truncate">{ws}</span>
                    {workspace === ws && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <div className="p-1.5 text-xs">
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors">
                <Key className="w-4 h-4 text-slate-400" />
                Security Credentials & API Keys
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors">
                <Server className="w-4 h-4 text-slate-400" />
                Cluster Nodes & Synchrotron API
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors">
                <Lock className="w-4 h-4 text-slate-400" />
                Lock Workstation
              </button>
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => alert('Signing out of MatterMind Workstation...')}
                className="w-full text-left px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Workstation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

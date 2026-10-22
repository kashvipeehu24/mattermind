import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, Key, Server, Lock, LogOut, CheckCircle2, UserCheck, LogIn } from 'lucide-react';
import { api, BackendUser } from '../../services/api';

export const UserProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<BackendUser | null>(api.getStoredUser());
  const [workspace, setWorkspace] = useState('Siemens Energy & Aerospace Hub');

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getCurrentUser()
        .then((fetchedUser) => {
          setUser(fetchedUser);
          api.setStoredUser(fetchedUser);
        })
        .catch(() => {
          // If token failed, keep stored or demo user
        });
    }
  }, []);

  const workspaces = [
    'Siemens Energy & Aerospace Hub',
    'Autodesk R&D Advanced Materials Lab',
    'Palantir Foundry Defense Node',
    'Airbus Cleanroom Metallurgy Vault'
  ];

  const handleSignOut = async () => {
    await api.logout();
    setUser(null);
    setIsOpen(false);
    navigate('/login');
  };

  const isAuth = api.isAuthenticated();
  const displayName = isAuth ? (user?.full_name || 'Dr. Helena Vance') : 'Offline Demo Explorer';
  const displayEmail = isAuth ? (user?.email || 'engineer@mattermind.ai') : 'No Active Session';
  const displayRole = isAuth
    ? (user?.role === 'admin' ? 'Foundry L4 Admin' : 'Senior Material Scientist')
    : 'Guest (Offline Preview)';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200 cursor-pointer"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200">
            {initials}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${isAuth ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-bold text-slate-900 leading-none">{displayName}</div>
          <div className="text-[10px] text-slate-500 leading-none mt-1">{displayRole}</div>
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
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    {displayName}
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-300">{displayEmail}</div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> {displayRole}
                </span>
                {isAuth ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Token Active
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Offline Demo
                  </span>
                )}
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
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
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Key className="w-4 h-4 text-slate-400" />
                Security Credentials & API Keys
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Server className="w-4 h-4 text-slate-400" />
                Cluster Nodes & Synchrotron API
              </button>
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-200">
              {api.isAuthenticated() ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Workstation
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-secondary hover:bg-blue-50 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Enterprise Node
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

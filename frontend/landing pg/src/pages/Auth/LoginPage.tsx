import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { api, APIError } from '../../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDemoSignIn = async (asAdmin: boolean = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const demoEmail = asAdmin ? 'admin@mattermind.ai' : 'engineer@mattermind.ai';
    const demoPass = 'MatterMind2026!';
    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      // 1. Attempt login with demo credentials on existing backend
      try {
        await api.login(demoEmail, demoPass);
        navigate('/dashboard');
        return;
      } catch (loginErr: any) {
        // If account does not exist in DB yet (400 or 401), attempt to register it on backend
        if (loginErr instanceof APIError && (loginErr.status === 400 || loginErr.status === 401)) {
          try {
            await api.register({
              email: demoEmail,
              password: demoPass,
              full_name: asAdmin ? 'Dr. Helena Vance' : 'Marcus Thorne',
              role: asAdmin ? 'admin' : 'user',
            });
            await api.login(demoEmail, demoPass);
            navigate('/dashboard');
            return;
          } catch (regErr: any) {
            throw new Error(regErr.message || loginErr.message);
          }
        }
        throw loginErr;
      }
    } catch (err: any) {
      // Do not invent fake tokens. Report actual backend status.
      setErrorMessage(
        `Backend authentication failed: ${err.message || 'Server unreachable at http://localhost:8000'}. Live token could not be issued.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExploreOffline = () => {
    // Honest offline demo mode: do not store fake JWT token
    api.removeToken();
    localStorage.setItem('mattermind_offline_mode', 'true');
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await api.register({
          email,
          password,
          full_name: fullName,
          role,
        });
        setSuccessMessage('Account registered successfully! Signing you in...');
        await api.login(email, password);
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        await api.login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.warn('Authentication API error:', err);
      if (err instanceof APIError) {
        setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      } else {
        setErrorMessage('Unable to reach authentication node. You can continue with Demo Quick Access.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-secondary/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header / Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 group text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <span>← Back to MatterMind Home</span>
        </Link>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/30">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">MatterMind</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mt-2">
          {isRegister ? 'Create Enterprise Account' : 'Sign in to Intelligence Command'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isRegister
            ? 'Access certified material passports, neural RUL predictions, and lifecycle telemetry.'
            : 'Enter your credentials to access the material vault and EU DPP ledger node.'}
        </p>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isRegister ? 'bg-secondary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isRegister ? 'bg-secondary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isRegister}
                    placeholder="e.g. Dr. Helena Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Enterprise Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-11 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-secondary transition-all"
                >
                  <option value="user">Material Scientist / Engineer (User)</option>
                  <option value="admin">Foundry Inspector / Administrator (Admin)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-secondary hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/25 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Continue' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Access Helper */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Demonstration Access
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoSignIn(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Engineer Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Demo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExploreOffline}
              className="text-[11px] font-medium text-slate-400 hover:text-white underline underline-offset-4 transition-colors pt-1 block w-full text-center"
            >
              Or explore workspace in offline preview mode (no backend credentials required)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

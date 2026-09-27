import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu, Link, Award, Sparkles } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative aspect-square w-full max-w-[620px] mx-auto select-none">
      {/* Main High-Tech Platform Diagram Canvas */}
      <div className="absolute inset-0 rounded-[40px] overflow-hidden border border-[#e2e8f0] bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-950 shadow-2xl p-6 md:p-8 flex flex-col justify-between">
        {/* Top Diagram Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#316bf3]" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              MatterMind Neural Grid v4.0
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400">Live Active Node</span>
          </div>
        </div>

        {/* Central Intelligence Grid Visualization */}
        <div className="relative my-auto py-6 grid grid-cols-2 gap-4">
          {/* AI Intelligence Engine Node */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#316bf3] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AI INTELLIGENCE ENGINE
              </span>
              <Sparkles className="w-4 h-4 text-[#316bf3]" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">Machine learning, optimization</div>
              <div className="text-[11px] text-slate-400">& predictive modeling</div>
            </div>
            <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#316bf3] h-full rounded-full w-[94%]" />
            </div>
          </div>

          {/* Compatibility Analysis Node */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#316bf3] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                COMPATIBILITY ANALYSIS
              </span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">Split-screen analysis</div>
              <div className="text-[11px] text-slate-400">Cross-batch verification</div>
            </div>
            <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[98.4%]" />
            </div>
          </div>

          {/* Material Passport Node */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#316bf3] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                MATERIAL PASSPORT
              </span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">Digital representation</div>
              <div className="text-[11px] text-slate-400">MT-9842-XQ specification</div>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-1 rounded">
              HASH: 0x8f3a...e412
            </div>
          </div>

          {/* Blockchain Verification Node */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#316bf3] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                BLOCKCHAIN VERIFICATION
              </span>
              <Link className="w-4 h-4 text-[#316bf3]" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">Hyperledger Ledger</div>
              <div className="text-[11px] text-slate-400">Immutable audit proof</div>
            </div>
            <div className="mt-3 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Immutable Signed
            </div>
          </div>
        </div>

        {/* Diagram Footer Bar */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>Enterprise Encryption Active</span>
          <span className="text-[#316bf3] font-semibold">Hyperledger Fabric Enabled</span>
        </div>
      </div>

      {/* FLOATING UI BADGES */}
      {/* 1. Compatibility Score (Top Left) */}
      <div
        className="absolute -top-4 -left-4 md:-top-6 md:-left-6 glass-card p-4 rounded-2xl shadow-xl floating z-20"
        style={{ animationDelay: '0s' }}
      >
        <div className="text-[10px] uppercase font-bold text-[#316bf3] mb-0.5">
          Compatibility Score
        </div>
        <div className="text-2xl font-black text-[#0f172a]">98.4%</div>
      </div>

      {/* 2. Verified Passport Badge (Top Right) */}
      <div
        className="absolute top-1/4 -right-4 md:-right-8 glass-card p-3.5 px-4 rounded-2xl shadow-xl floating z-20"
        style={{ animationDelay: '1s' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-bold text-[#0f172a]">Verified Passport</span>
        </div>
      </div>

      {/* 3. AI Confidence (Middle Left) */}
      <div
        className="absolute top-1/2 -left-6 md:-left-12 glass-card p-3.5 px-4 rounded-2xl shadow-xl floating z-20"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="text-[10px] uppercase font-bold text-[#316bf3] mb-0.5">
          AI Confidence
        </div>
        <div className="text-lg font-black text-[#0f172a]">99.2%</div>
      </div>

      {/* 4. Risk Score Low (Middle Right) */}
      <div
        className="absolute top-2/3 -right-2 md:right-2 glass-card p-3 rounded-xl shadow-lg border-emerald-100/80 z-20"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-[#0f172a]">Risk Score: Low</span>
        </div>
      </div>

      {/* 5. Remaining Useful Life (Bottom Left) */}
      <div
        className="absolute bottom-1/4 -left-4 md:-left-8 glass-card p-3.5 px-4 rounded-2xl shadow-xl floating z-20"
        style={{ animationDelay: '2s' }}
      >
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
          Remaining Useful Life
        </div>
        <div className="text-xl font-bold text-[#0f172a]">24 Months</div>
      </div>

      {/* 6. Blockchain Verified Badge (Bottom Center) */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass-card p-3 px-4 rounded-xl shadow-lg floating z-20 whitespace-nowrap"
        style={{ animationDelay: '2.5s' }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#316bf3]" />
          <span className="text-xs font-bold text-[#0f172a]">Blockchain Verified: Success</span>
        </div>
      </div>

      {/* 7. Carbon Saved (Bottom Right) */}
      <div
        className="absolute -bottom-6 right-4 md:right-8 glass-card p-4 rounded-2xl shadow-xl floating z-20"
        style={{ animationDelay: '1.5s' }}
      >
        <div className="text-[10px] uppercase font-bold text-emerald-600 mb-0.5">
          Carbon Saved
        </div>
        <div className="text-2xl font-black text-emerald-700">1.2M kg</div>
      </div>
    </div>
  );
};

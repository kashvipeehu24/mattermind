import React from 'react';
import { ShieldCheck, Leaf, TrendingUp, QrCode, CheckCircle2, Globe, Clock, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { passportMock } from '../../data/mockData';

export const MaterialPassportSection: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-white overflow-hidden border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Left Interactive Passport Card Graphic */}
        <div className="flex-1 w-full order-2 lg:order-1">
          <div className="relative max-w-[560px] mx-auto bg-slate-900 text-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  DIGITAL MATERIAL PASSPORT
                </span>
                <h4 className="text-xl font-bold text-white mt-1">
                  Material ID: <span className="font-mono text-[#316bf3]">{passportMock.materialId}</span>
                </h4>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Passport Body Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-1">Material Type</span>
                <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#316bf3]" />
                  {passportMock.materialType}
                </span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-1">Manufacturer</span>
                <span className="text-sm font-bold text-slate-100">
                  {passportMock.manufacturer}
                </span>
              </div>
            </div>

            {/* Material Health Bar */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Material Health Score</span>
                <span className="text-sm font-bold text-emerald-400">{passportMock.materialHealth}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${passportMock.materialHealth}%` }}
                />
              </div>
            </div>

            {/* Metrics & QR */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-[#316bf3]" />
                  <span>Remaining Useful Life: <strong>{passportMock.remainingLife}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Risk Level: <strong className="text-emerald-400">{passportMock.riskLevel} ↑</strong></span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-2.5 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-200">
                <QrCode className="w-12 h-12 text-slate-900" />
                <span className="text-[9px] font-mono text-slate-600 mt-1">SCAN MATTERMIND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 order-1 lg:order-2">
          <Badge variant="primary" className="mb-6">
            Digital Identity
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">
            The Digital Material Passport.
          </h2>

          <p className="text-lg md:text-xl text-[#45464d] leading-relaxed mb-8">
            An immutable record that follows the material from the mine to the final assembly. Every transaction, test result, and environmental impact is cryptographically signed and stored on a distributed ledger.
          </p>

          <ul className="space-y-5">
            <li className="flex items-center gap-4 text-lg font-semibold text-[#0f172a]">
              <div className="w-10 h-10 rounded-xl bg-[#316bf3]/10 flex items-center justify-center text-[#316bf3] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>Anti-counterfeit Protection</span>
            </li>

            <li className="flex items-center gap-4 text-lg font-semibold text-[#0f172a]">
              <div className="w-10 h-10 rounded-xl bg-[#316bf3]/10 flex items-center justify-center text-[#316bf3] shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <span>ESG Compliance Automation</span>
            </li>

            <li className="flex items-center gap-4 text-lg font-semibold text-[#0f172a]">
              <div className="w-10 h-10 rounded-xl bg-[#316bf3]/10 flex items-center justify-center text-[#316bf3] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span>Historical Fatigue Tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

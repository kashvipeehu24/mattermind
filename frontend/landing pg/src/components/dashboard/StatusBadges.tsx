import React from 'react';
import { AlertSeverity, PassportStatus } from '../../types';
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, FileCheck, Shield, Clock } from 'lucide-react';

export const HealthBadge: React.FC<{ score: number; showLabel?: boolean }> = ({ score, showLabel = true }) => {
  let bgColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotColor = 'bg-emerald-500';
  let label = 'Optimal';

  if (score >= 90) {
    bgColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = 'Optimal';
  } else if (score >= 75) {
    bgColor = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
    label = 'Good';
  } else if (score >= 60) {
    bgColor = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
    label = 'Degrading';
  } else {
    bgColor = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
    label = 'Critical';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span>{score.toFixed(1)}%</span>
      {showLabel && <span className="opacity-75 font-normal">({label})</span>}
    </div>
  );
};

export const BlockchainBadge: React.FC<{ verified: boolean; hash?: string }> = ({ verified }) => {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
        <Shield className="w-3.5 h-3.5" />
        Verified Immutable
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3.5 h-3.5" />
      Pending Ledger Sync
    </span>
  );
};

export const PassportBadge: React.FC<{ status: PassportStatus }> = ({ status }) => {
  switch (status) {
    case 'compliant':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          EU DPP Compliant
        </span>
      );
    case 'certified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          ISO Certified
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Audit in Progress
        </span>
      );
    case 'non_compliant':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Non-Compliant
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Critical Risk
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Warning
        </span>
      );
    case 'info':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          Notice
        </span>
      );
    case 'optimal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Optimal
        </span>
      );
  }
};

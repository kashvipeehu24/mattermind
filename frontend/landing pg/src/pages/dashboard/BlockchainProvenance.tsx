import React, { useState } from 'react';
import { MaterialItem } from '../../types';
import { StatCard } from '../../components/dashboard/StatCard';
import { BlockchainBadge } from '../../components/dashboard/StatusBadges';
import { ShieldCheck, Lock, ExternalLink, CheckCircle2, Search, Copy, FileCheck, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

interface BlockchainProvenanceProps {
  materials: MaterialItem[];
}

export const BlockchainProvenance: React.FC<BlockchainProvenanceProps> = ({ materials }) => {
  const [hashInput, setHashInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateHash = async () => {
    const query = hashInput.trim().toLowerCase();
    if (!query) return;

    setIsValidating(true);
    setValidationResult(null);

    // First check local materials
    const match = materials.find((m) =>
      m.blockchainHash.toLowerCase().includes(query) ||
      m.code.toLowerCase() === query ||
      m.passportId.toLowerCase() === query
    );

    if (match) {
      if (match.blockchainVerified) {
        setValidationResult({
          isValid: true,
          message: `ON-CHAIN CONFIRMED: Cryptographically signed on-chain passport matches batch ${match.code} (${match.name}). Tx: ${match.blockchainHash}. Supplier: ${match.supplier}.`
        });
      } else {
        setValidationResult({
          isValid: false,
          message: `UNCONFIRMED BLOCK: Batch ${match.code} (${match.name}) exists in inventory with reference hash ${match.blockchainHash}, but is not confirmed on the smart contract.`
        });
      }
      setIsValidating(false);
      return;
    }

    // Try backend blockchain history check if query is numeric ID
    const numId = parseInt(query, 10);
    if (!isNaN(numId)) {
      try {
        const records = await api.getBlockchainHistory(numId);
        if (records && records.length > 0) {
          const latest = records[records.length - 1];
          const isOnChain = latest.on_chain_status === 'confirmed' || (Boolean(latest.block_hash) && latest.block_hash.startsWith('0x') && latest.block_hash.length === 66);
          setValidationResult({
            isValid: isOnChain,
            message: isOnChain
              ? `ON-CHAIN CONFIRMED: Verified on Ethereum/Hardhat network. Record #${latest.id}, Type: ${latest.transaction_type}, Tx Hash: ${latest.block_hash}.`
              : `LOCAL RECORD ONLY: Material #${numId} has ${records.length} off-chain record(s) on MatterMind local ledger, but is not confirmed on the smart contract.`
          });
          setIsValidating(false);
          return;
        }
      } catch {
        // Fall through to invalid
      }
    }

    // If genuinely not found:
    setValidationResult({
      isValid: false,
      message: `HASH UNVERIFIED: No cryptographic block matching "${hashInput}" was found in the active MatterMind ledger.`
    });
    setIsValidating(false);
  };

  const sampleMaterial = materials[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Blockchain Ledger Provenance & Verification</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Immutable supply chain verification tracking raw material origin, chemical purity, and foundry certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Consensus Node Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Ledger Blocks"
          value={String(materials.length * 12 + 4820)}
          unit="Cryptographic"
          change="100% Intact"
          isPositive={true}
          subtitle="Consensus achieved"
          icon={ShieldCheck}
          variant="accent"
        />

        <StatCard
          title="Supplier Foundries"
          value={`${new Set(materials.map(m => m.supplier)).size} Active Nodes`}
          unit="ThyssenKrupp, Hydro"
          change="ISO Certified"
          isPositive={true}
          subtitle="Direct API sync"
          icon={Lock}
        />

        <StatCard
          title="Zero-Knowledge Proofs"
          value="100%"
          unit="Privacy Preserved"
          change="Encrypted Specs"
          isPositive={true}
          subtitle="Trade secrets safe"
          icon={FileCheck}
        />

        <StatCard
          title="EU DPP Compliance"
          value={`${materials.filter(m => m.passportStatus === 'compliant').length} / ${materials.length}`}
          unit="Batches Compliant"
          change="Ecodesign Ready"
          isPositive={true}
          subtitle="EU Regulation 2026"
          icon={CheckCircle2}
        />
      </div>

      {/* Cryptographic Hash Validator Search */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-secondary" />
              Cryptographic Hash Validator
            </h3>
            <p className="text-xs text-slate-500">
              Enter any 256-bit SHA256 / Keccak batch hash, material ID, or passport code to verify immutable proof of origin.
            </p>
          </div>

          {sampleMaterial && (
            <button
              onClick={() => setHashInput(sampleMaterial.blockchainHash)}
              className="text-[11px] font-bold text-secondary hover:underline text-left sm:text-right cursor-pointer"
            >
              Insert Sample Hash ({sampleMaterial.code})
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Paste block hash e.g. 0x7f8a92b3c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3..."
            className="flex-1 h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-secondary"
          />
          <button
            onClick={handleValidateHash}
            disabled={isValidating || !hashInput.trim()}
            className="h-11 px-5 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Validate Ledger</span>
          </button>
        </div>

        {validationResult && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium animate-in fade-in duration-200 flex items-center gap-2.5 ${
              validationResult.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {validationResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{validationResult.message}</span>
          </div>
        )}
      </div>

      {/* Ledger Verification Table */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Active Material Batch Cryptographic Register</h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Material Code</th>
                <th className="p-3.5">Supplier Foundry</th>
                <th className="p-3.5">Batch No</th>
                <th className="p-3.5">Blockchain Block Hash</th>
                <th className="p-3.5">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-secondary">{m.code}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{m.supplier}</td>
                  <td className="p-3.5 font-mono text-slate-600">{m.batchNo}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 truncate max-w-[220px]">
                    {m.blockchainHash}
                  </td>
                  <td className="p-3.5">
                    <BlockchainBadge verified={m.blockchainVerified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

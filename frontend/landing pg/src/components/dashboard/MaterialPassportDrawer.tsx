import React, { useState, useEffect } from 'react';
import { MaterialItem } from '../../types';
import { HealthBadge, BlockchainBadge, PassportBadge, SeverityBadge } from './StatusBadges';
import { api, BackendMaterialPassport, BackendAnalysis, BackendBlockchainRecord } from '../../services/api';
import {
  X,
  FileCheck,
  ShieldCheck,
  Cpu,
  Layers,
  Leaf,
  Clock,
  ExternalLink,
  Download,
  Share2,
  AlertTriangle,
  Sparkles,
  Award,
  Factory,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface MaterialPassportDrawerProps {
  material: MaterialItem | null;
  onClose: () => void;
}

export const MaterialPassportDrawer: React.FC<MaterialPassportDrawerProps> = ({
  material,
  onClose
}) => {
  const [livePassport, setLivePassport] = useState<BackendMaterialPassport | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<BackendAnalysis | null>(null);
  const [blockchainHistory, setBlockchainHistory] = useState<BackendBlockchainRecord[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!material) {
      setLivePassport(null);
      setAiAnalysis(null);
      setBlockchainHistory([]);
      return;
    }

    // Try fetching live passport from backend if numeric ID
    const numId = parseInt(material.id, 10);
    if (!isNaN(numId)) {
      api.getMaterialPassport(numId)
        .then((p) => setLivePassport(p))
        .catch(() => setLivePassport(null));

      api.getAIHistory(numId)
        .then((history) => {
          if (history && history.length > 0) {
            setAiAnalysis(history[history.length - 1]);
          }
        })
        .catch(() => {});

      api.getBlockchainHistory(numId)
        .then((records) => {
          if (records && records.length > 0) {
            setBlockchainHistory(records);
          }
        })
        .catch(() => setBlockchainHistory([]));
    }
  }, [material]);

  if (!material) return null;

  const latestRecord = blockchainHistory.length > 0 ? blockchainHistory[blockchainHistory.length - 1] : null;
  const currentPassportId = livePassport?.passport_id || material.passportId;
  const currentHash = latestRecord?.block_hash || livePassport?.blockchain_hash || material.blockchainHash;
  const isOnChain = Boolean(
    latestRecord?.on_chain_status === 'confirmed' ||
    (latestRecord?.block_hash && latestRecord.block_hash.startsWith('0x') && latestRecord.block_hash.length === 66) ||
    (material.blockchainVerified && currentHash.startsWith('0x') && currentHash.length === 66)
  );

  const handleDownloadCertificate = () => {
    const certificateData = {
      standard: "EU Digital Product Passport (DPP) Compliance Certificate",
      regulation: "ESPR Regulation (EU) 2026/88192",
      verificationProtocol: "ISO 14040/14044 LCA Cryptographic Protocol",
      passportId: currentPassportId,
      materialIdentifier: material.code,
      materialName: material.name,
      category: material.category,
      chemicalComposition: material.composition,
      foundrySupplier: material.supplier,
      densityGcm3: material.densityGcm3,
      tensileStrengthMpa: material.tensileStrengthMpa,
      healthScore: `${material.healthIndex}/100`,
      remainingUsefulLife: `${material.remainingUsefulLifeYears} Years`,
      recyclabilityGrade: material.recyclabilityGrade,
      carbonFootprintKgCo2: material.embodiedCarbonKgCo2,
      cryptographicBlockHash: currentHash,
      ledgerVerificationStatus: isOnChain ? "VERIFIED_ON_CHAIN" : "LOCAL_UNCONFIRMED_HASH",
      contractAddress: latestRecord?.contract_address || undefined,
      issuedAt: new Date().toISOString(),
      authorizedSigner: "European Material Intelligence Agency (EMIA) - Node DE-04"
    };

    const blob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EU-DPP-${material.code}-${currentPassportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/material/${material.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleTriggerAiAnalysis = async () => {
    const numId = parseInt(material.id, 10);
    setIsLoadingAi(true);
    try {
      if (!isNaN(numId)) {
        const result = await api.analyzeMaterial(numId);
        setAiAnalysis(result);
      } else {
        // Fallback for mock IDs
        setTimeout(() => {
          setAiAnalysis({
            id: 999,
            material_id: 1,
            analysis_type: "Material Health",
            prediction: material.healthIndex > 80 ? "Excellent" : "Good",
            confidence_score: 94.5,
            recommendation: material.healthIndex > 80 ? "Reuse in High-Stress Aerospace Subsystem" : "Schedule Refurbishment",
            explanation: `Rule-based AI analysis confirms ${material.name} lattice stability with optimal ISO-14040 lifecycle parameters.`,
            model_name: "MatterMind Neural Predictor",
            model_version: "v4.8",
            created_at: new Date().toISOString()
          });
          setIsLoadingAi(false);
        }, 600);
      }
    } catch (err) {
      console.warn('AI analysis API call fallback:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-secondary-fixed">
                  {material.code}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {material.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white truncate max-w-md">
                {material.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Health Index</span>
              <div className="mt-1">
                <HealthBadge score={material.healthIndex} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Passport Status</span>
              <div className="mt-1">
                <PassportBadge status={material.passportStatus} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ledger Verification</span>
              <div className="mt-1">
                <BlockchainBadge verified={material.blockchainVerified} />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Recyclability</span>
              <div className="mt-1 font-bold text-emerald-700 text-sm">
                Grade {material.recyclabilityGrade}
              </div>
            </div>
          </div>

          {/* Digital Product Passport Overview Card */}
          <div className="p-4 rounded-xl border border-secondary/30 bg-gradient-to-r from-secondary/5 to-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> EU Digital Product Passport (DPP)
              </span>
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {currentPassportId}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              This passport contains cryptographically verifiable lifecycle data, chemical provenance, and scope 1-3 carbon metrics in compliance with EU ESPR (Ecodesign for Sustainable Products Regulation) standards.
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/60 text-slate-500">
              <span>Issuer: <strong className="text-slate-800">European Material Intelligence Agency (EMIA)</strong></span>
              <span>Audit Date: <strong className="text-slate-800">{material.lastTestedDate}</strong></span>
            </div>
          </div>

          {/* Chemical & Micro-Structure Specification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-slate-700" /> Chemical & Micro-Structure Specification
            </h3>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Elemental Composition Formula</span>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 font-bold tracking-wide">
                  {material.composition}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Density</span>
                  <span className="font-bold text-slate-900">{material.densityGcm3} g/cm³</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Tensile Strength</span>
                  <span className="font-bold text-slate-900">{material.tensileStrengthMpa} MPa</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Thermal Cond.</span>
                  <span className="font-bold text-slate-900">{material.thermalConductivity} W/m·K</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Embodied CO₂</span>
                  <span className="font-bold text-emerald-600">{material.embodiedCarbonKgCo2} kg/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-secondary" /> AI Degradation Analysis & Recommendation
              </h3>
              <button
                onClick={handleTriggerAiAnalysis}
                disabled={isLoadingAi}
                className="text-[11px] font-bold text-secondary hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
                {aiAnalysis ? 'Re-run Analysis' : 'Run Live AI Analysis'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Predicted Useful Life</span>
                  <div className="text-2xl font-black text-white">{material.remainingUsefulLifeYears} Years</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">AI Recommendation</span>
                  <div className="text-base font-bold text-emerald-400">
                    {aiAnalysis ? aiAnalysis.recommendation : 'Reuse & Secondary Forming'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block mb-1">
                  Diagnostics ({aiAnalysis?.model_name || 'MatterMind Neural Predictor'}):
                </span>
                {aiAnalysis?.explanation || material.notes}
              </div>
            </div>
          </div>

          {/* Blockchain Provenance Chain */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700" /> Immutable Ledger Provenance
            </h3>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ledger Verification:</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  isOnChain ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {isOnChain ? 'Verified On-Chain' : 'Off-Chain Record'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cryptographic Block Hash:</span>
                <span className="font-mono text-[11px] text-secondary font-semibold truncate max-w-[220px]">
                  {currentHash}
                </span>
              </div>
              {latestRecord?.contract_address && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Smart Contract:</span>
                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
                    {latestRecord.contract_address}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supplier / Foundry:</span>
                <span className="font-bold text-slate-900">{material.supplier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Batch Control Number:</span>
                <span className="font-mono text-slate-900">{material.batchNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Physical Vault Location:</span>
                <span className="font-medium text-slate-800">{material.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadCertificate}
            className="flex-1 h-11 bg-slate-900 hover:bg-secondary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Passport Certificate (JSON)
          </button>

          <button
            onClick={handleShare}
            className="h-11 px-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share DPP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

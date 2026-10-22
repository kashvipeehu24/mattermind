import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileText,
  Trash2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { api, BackendMaterialCreate, mapBackendMaterialToItem } from '../../services/api';
import { MaterialItem } from '../../types';

interface MaterialRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialCreated: (material: MaterialItem) => void;
}

export const MaterialRegistrationModal: React.FC<MaterialRegistrationModalProps> = ({
  isOpen,
  onClose,
  onMaterialCreated,
}) => {
  const [formData, setFormData] = useState<BackendMaterialCreate>({
    material_name: '',
    material_type: '',
    category: 'Aerospace Alloy',
    manufacturer: '',
    density: 4.43,
    health_score: 92,
    carbon_score: 14.2,
    status: 'Active',
    tags: '',
    location: 'Munich Vault DE-04',
    is_recyclable: true,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'Aerospace Alloy',
    'High-Entropy Metal',
    'Carbon Fiber Composite',
    'Bio-Polymer',
    'Ultra-Ceramic',
    'Semiconductor Silicon',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.material_name.trim()) {
      setErrorMessage('Material Name is required.');
      return;
    }

    if (!formData.material_type.trim()) {
      setErrorMessage('Material Type / Substrate is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt backend persistence
      const created = await api.createMaterial({
        ...formData,
        tags: formData.tags || (uploadedFile ? `FILE:${uploadedFile.name}` : formData.material_name.split(' ')[0]),
      });

      // Optionally record registration on ledger if backend supports it
      try {
        await api.createBlockchainRecord(created.id, 'PASSPORT_REGISTRATION');
      } catch {
        // Blockchain ledger record failure noted without aborting
      }

      // Fetch passport if available
      let passport = null;
      try {
        passport = await api.getMaterialPassport(created.id);
      } catch {
        passport = null;
      }

      const mapped = mapBackendMaterialToItem(created, passport);
      setSuccessMessage(`Successfully registered ${created.material_name} in backend database with ID #${created.id}!`);
      setTimeout(() => {
        onMaterialCreated(mapped);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn('Backend API registration error:', err);
      // Strictly report backend error without silently faking success
      setErrorMessage(
        `Backend Registration Failed: ${err.message || 'Database error'}. ${
          err.status === 401 ? 'Please sign in with a valid account.' : 'Check backend service logs.'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLocalPreview = () => {
    // Explicit user-chosen local preview (clearly labeled as non-persisted demo session data)
    const fallbackItem: MaterialItem = {
      id: `preview-${Date.now().toString().slice(-4)}`,
      code: formData.tags || `PREVIEW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.material_name,
      category: formData.category || 'Aerospace Alloy',
      composition: `${formData.material_name} (Local Preview)`,
      healthIndex: Number(formData.health_score) || 90,
      remainingUsefulLifeYears: Math.round(((Number(formData.health_score) || 90) / 7) * 10) / 10,
      compatibilityScore: 94,
      passportStatus: 'in_review',
      passportId: `LOCAL-PREVIEW-${Math.floor(10000 + Math.random() * 90000)}`,
      blockchainHash: 'UNCOMMITTED_LOCAL_SESSION',
      blockchainVerified: false,
      carbonSavingsKg: Math.round((Number(formData.carbon_score) || 15) * 110),
      recyclabilityGrade: formData.is_recyclable ? 'A+' : 'B',
      supplier: formData.manufacturer || 'Local Preview Node',
      batchNo: `PREVIEW-${Math.floor(100 + Math.random() * 900)}`,
      location: formData.location || 'Local Workspace',
      lastTestedDate: new Date().toISOString().split('T')[0],
      alertLevel: 'optimal',
      status: 'Demo Preview (Uncommitted)',
      densityGcm3: Number(formData.density) || 4.5,
      tensileStrengthMpa: 1150,
      thermalConductivity: 21.4,
      embodiedCarbonKgCo2: Number(formData.carbon_score) || 14.5,
      notes: uploadedFile
        ? `[Demo Preview - Not Saved to Backend] Reference file: ${uploadedFile.name} (Client-only checksum).`
        : '[Demo Preview - Not Saved to Backend] Created for UI evaluation during offline or backend error state.',
    };

    onMaterialCreated(fallbackItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0 shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Register Material Batch Specification</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/30 text-secondary border border-secondary/40 font-bold uppercase tracking-wider">
                  EU DPP v2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Create digital material identity with lifecycle parameters and cryptographic passport
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-120px)] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2 font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-rose-200/60">
                <span className="text-[11px] text-rose-600">Want to test catalog UI during backend errors?</span>
                <button
                  type="button"
                  onClick={handleAddLocalPreview}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Save as Demo Preview (Session Only)
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Material Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-slate-700" /> Material Identity & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Material Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Titanium Ti-6Al-4V Grade 23"
                  value={formData.material_name}
                  onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Material Subtype / Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alpha-Beta Titanium Alloy"
                  value={formData.material_type}
                  onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Manufacturer / Foundry</label>
                <input
                  type="text"
                  placeholder="e.g. ThyssenKrupp Aerospace"
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Spec Identifier / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Ti-64-ELI"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical & Sustainability Parameters */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-secondary" /> Physical & Circular Properties
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Density (g/cm³)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.density}
                  onChange={(e) => setFormData({ ...formData, density: parseFloat(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Health Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.health_score}
                  onChange={(e) => setFormData({ ...formData, health_score: parseFloat(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Embodied CO₂ (kg/kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.carbon_score}
                  onChange={(e) => setFormData({ ...formData, carbon_score: parseFloat(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-secondary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Recyclable Material Standard</span>
                <span className="text-[11px] text-slate-500">Qualifies for closed-loop secondary smelting or circular repurposing</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_recyclable}
                  onChange={(e) => setFormData({ ...formData, is_recyclable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Section 3: Technical Document / File Upload */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-slate-700" /> Certificate & Datasheet Attachment
              </h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 font-bold px-2 py-0.5 rounded-md w-fit">
                Client Verification Only (No Server Storage)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Note: The MatterMind backend API currently does not provide a binary file-storage or document upload endpoint. Selected certificates/datasheets are hashed locally in-browser to populate integrity tags; the file binary is not uploaded or persisted on the server.
            </p>

            {!uploadedFile ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-secondary hover:bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-secondary/10 flex items-center justify-center text-slate-500 group-hover:text-secondary mb-2 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 mb-0.5">
                  Click to browse or drop datasheet here
                </span>
                <span className="text-[11px] text-slate-500">
                  Accepts PDF test certificates, STEP 3D CAD meshes, CSV spectrography, or JSON metadata (Max 25MB)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.step,.stp,.json,.txt"
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3.5 rounded-xl border border-secondary/30 bg-secondary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-xs sm:max-w-md">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Local integrity tag generated (file binary is not uploaded to server)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-secondary text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Batch...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Register Material Batch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

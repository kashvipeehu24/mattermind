import React, { useState } from 'react';
import { MaterialItem, AlertSeverity, PassportStatus } from '../types';
import { HealthBadge, BlockchainBadge, PassportBadge } from './StatusBadges';
import {
  ArrowUpDown,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface MaterialTableProps {
  materials: MaterialItem[];
  onSelectMaterial: (material: MaterialItem) => void;
  title?: string;
}

export const MaterialTable: React.FC<MaterialTableProps> = ({
  materials,
  onSelectMaterial,
  title = "Enterprise Material Intelligence Catalog"
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof MaterialItem>('healthIndex');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ['All', 'Aerospace Alloy', 'High-Entropy Metal', 'Carbon Fiber Composite', 'Bio-Polymer', 'Ultra-Ceramic', 'Semiconductor Silicon'];

  const handleSort = (field: keyof MaterialItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.passportId.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage) || 1;
  const paginatedMaterials = sortedMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">
            Real-time telemetry, EU Digital Product Passport (DPP) status, and blockchain ledger hashes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search within table */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter batch or code..."
              className="h-9 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <button
            onClick={() => alert('Exporting material catalog report in CSV/ISO 14040 format...')}
            className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="p-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Material ID <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Material Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-1">
                  Category <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('compatibilityScore')}>
                <div className="flex items-center gap-1">
                  Compatibility <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('remainingUsefulLifeYears')}>
                <div className="flex items-center gap-1">
                  RUL <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Passport Status</th>
              <th className="p-3">Blockchain Status</th>
              <th className="p-3">Risk Level</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedMaterials.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  No material entries found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedMaterials.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelectMaterial(m)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="p-3 font-mono text-secondary font-bold whitespace-nowrap">
                    {m.id}
                  </td>

                  <td className="p-3 font-bold text-slate-900">
                    <div className="font-mono text-slate-900 group-hover:text-secondary group-hover:underline flex items-center gap-1.5">
                      {m.code}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal truncate max-w-[180px]">
                      {m.name}
                    </div>
                  </td>

                  <td className="p-3 text-slate-700 font-medium whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {m.category}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-secondary text-xs">{m.compatibilityScore}%</span>
                  </td>

                  <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                    {m.remainingUsefulLifeYears} Yrs
                  </td>

                  <td className="p-3">
                    <PassportBadge status={m.passportStatus} />
                  </td>

                  <td className="p-3">
                    <BlockchainBadge verified={m.blockchainVerified} />
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      m.alertLevel === 'optimal'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : m.alertLevel === 'warning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : m.alertLevel === 'critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {m.alertLevel}
                    </span>
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMaterial(m);
                      }}
                      className="p-1.5 text-slate-500 hover:text-secondary hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>
          Showing {paginatedMaterials.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedMaterials.length)} of {sortedMaterials.length} materials
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-slate-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

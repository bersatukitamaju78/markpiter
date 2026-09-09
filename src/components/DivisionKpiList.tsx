import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  FileSpreadsheet, 
  Table as TableIcon, 
  LayoutGrid, 
  ShieldCheck, 
  Filter, 
  CheckSquare, 
  Square,
  Sparkles,
  Link2
} from 'lucide-react';
import { DivisionKPI, DivisionProfile, BSCCategory } from '../types';
import { BSC_PERSPECTIVE_META } from '../data/corporateKPIs';

interface DivisionKpiListProps {
  kpis: DivisionKPI[];
  profile: DivisionProfile;
  onToggleSelectKpi: (id: string) => void;
  onSelectAllKpis: () => void;
  onDeselectAllKpis: () => void;
  onEditKpi: (kpi: DivisionKPI) => void;
  onDeleteKpi: (id: string) => void;
  onAddManualKpi: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onExport: () => void;
  onBackToProfile: () => void;
  onProceedToOfficer: () => void;
}

export const DivisionKpiList: React.FC<DivisionKpiListProps> = ({
  kpis,
  profile,
  onToggleSelectKpi,
  onSelectAllKpis,
  onDeselectAllKpis,
  onEditKpi,
  onDeleteKpi,
  onAddManualKpi,
  onMoveUp,
  onMoveDown,
  onExport,
  onBackToProfile,
  onProceedToOfficer,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedPerspective, setSelectedPerspective] = useState<string>('ALL');

  const activeKpis = kpis.filter(k => k.isSelected !== false);
  const categories: BSCCategory[] = ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'];

  const filteredKpis = kpis.filter(kpi => {
    if (selectedPerspective === 'ALL') return true;
    return kpi.kpiType === selectedPerspective;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Summary Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Tahap 3 dari 3
              </span>
              <span className="text-xs text-slate-500 font-medium">Matriks KPI Divisi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Daftar Usulan Matriks KPI Divisi: {profile.divisionName}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Tinjau, edit, pilih, atau sesuaikan KPI Divisi di bawah ini. KPI telah diselaraskan dengan KPI Korporat dan standar transmisi gas alam (ASME B31.8S, API 1160, PHMSA, ISO 55001).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 self-start lg:self-center shrink-0">
            <div className="text-center px-2">
              <span className="text-xs text-slate-500 block font-medium">KPI Digunakan</span>
              <span className="text-lg font-bold text-blue-700">
                {activeKpis.length} <span className="text-xs font-normal text-slate-400">/ {kpis.length}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-500 block font-medium">Pemilik KPI</span>
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[140px]" title={`Kepala ${profile.divisionName}`}>
                Kepala {profile.divisionName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Perspective Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          <button
            type="button"
            onClick={() => setSelectedPerspective('ALL')}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border transition cursor-pointer shrink-0 ${
              selectedPerspective === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Semua ({kpis.length})
          </button>
          {categories.map((cat) => {
            const count = kpis.filter(k => k.kpiType === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedPerspective(cat)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border transition cursor-pointer shrink-0 ${
                  selectedPerspective === cat
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kartu
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Add Manual Button */}
          <button
            type="button"
            onClick={onAddManualKpi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Tambah KPI Manual</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExport}
            disabled={activeKpis.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export KPI Divisi</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-3 w-12 text-center">Gunakan</th>
                  <th className="py-3.5 px-2 w-10 text-center">No</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Division KPI & Definisi</th>
                  <th className="py-3.5 px-3 min-w-[140px]">KPI Type</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Measurement / Formula & Unit</th>
                  <th className="py-3.5 px-3 min-w-[130px]">Target</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Rationale & Standar Acuan</th>
                  <th className="py-3.5 px-3 w-28 text-center">Aksi / Urutan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredKpis.map((kpi, idx) => {
                  const isSelected = kpi.isSelected !== false;
                  const originalIndex = kpis.findIndex(k => k.id === kpi.id);
                  const meta = BSC_PERSPECTIVE_META[kpi.kpiType];

                  return (
                    <tr
                      key={kpi.id}
                      className={`hover:bg-slate-50/80 transition duration-150 ${
                        !isSelected ? 'opacity-50 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-3 text-center align-top">
                        <button
                          type="button"
                          onClick={() => onToggleSelectKpi(kpi.id)}
                          className={`w-5 h-5 rounded-md inline-flex items-center justify-center border transition cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Number */}
                      <td className="py-4 px-2 text-center text-xs font-bold text-slate-400 align-top">
                        {originalIndex + 1}
                      </td>

                      {/* Division KPI & Definition */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 leading-snug mb-1">
                          {kpi.divisionKpi}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {kpi.definition}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span>Owner: <strong className="text-slate-700">{kpi.kpiOwner || `Kepala ${profile.divisionName}`}</strong></span>
                          {kpi.linkedCorporateKpiName && (
                            <span className="flex items-center gap-1 text-blue-600 truncate max-w-xs" title={kpi.linkedCorporateKpiName}>
                              <Link2 className="w-3 h-3" />
                              {kpi.linkedCorporateKpiName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* KPI Type */}
                      <td className="py-4 px-3 align-top">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta?.bgBadge || 'bg-slate-100 text-slate-700'}`}>
                          {kpi.kpiType}
                        </span>
                      </td>

                      {/* Measurement & Unit */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-md border border-slate-200 leading-relaxed mb-1">
                          {kpi.measurementFormula}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Satuan: <strong className="text-slate-700">{kpi.unit}</strong>
                        </div>
                      </td>

                      {/* Target */}
                      <td className="py-4 px-3 align-top">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                          {kpi.target}
                        </span>
                      </td>

                      {/* Rationale & Standard */}
                      <td className="py-4 px-4 align-top text-xs text-slate-600 leading-relaxed">
                        <p className="mb-1.5">{kpi.rationale}</p>
                        {kpi.gasStandardRef && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            {kpi.gasStandardRef}
                          </div>
                        )}
                      </td>

                      {/* Actions & Reorder */}
                      <td className="py-4 px-3 align-top">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onMoveUp(originalIndex)}
                            disabled={originalIndex === 0}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Pindah ke atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveDown(originalIndex)}
                            disabled={originalIndex === kpis.length - 1}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Pindah ke bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditKpi(kpi)}
                            className="p-1 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
                            title="Edit KPI"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteKpi(kpi.id)}
                            className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                            title="Hapus KPI"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKpis.map((kpi, idx) => {
            const isSelected = kpi.isSelected !== false;
            const originalIndex = kpis.findIndex(k => k.id === kpi.id);
            const meta = BSC_PERSPECTIVE_META[kpi.kpiType];

            return (
              <div
                key={kpi.id}
                className={`bg-white rounded-xl border-2 p-5 shadow-xs transition flex flex-col justify-between ${
                  isSelected ? 'border-blue-600 bg-white' : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleSelectKpi(kpi.id)}
                        className={`w-5 h-5 rounded-md inline-flex items-center justify-center border transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white hover:border-blue-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <span className="text-xs font-bold text-slate-400">
                        #{originalIndex + 1}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta?.bgBadge}`}>
                      {kpi.kpiType}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug mb-2">
                    {kpi.divisionKpi}
                  </h4>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {kpi.definition}
                  </p>

                  <div className="space-y-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block mb-0.5">Formula Pengukuran:</span>
                      <code className="font-mono text-slate-800 block text-[11px] bg-white p-1.5 rounded border border-slate-200">
                        {kpi.measurementFormula}
                      </code>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Satuan: <strong className="text-slate-800">{kpi.unit}</strong></span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Target: {kpi.target}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    <strong className="text-slate-700">Rationale:</strong> {kpi.rationale}
                  </div>

                  {kpi.gasStandardRef && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200 mb-3">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      Standar Acuan: {kpi.gasStandardRef}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Owner: <strong>{kpi.kpiOwner || `Kepala ${profile.divisionName}`}</strong>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveUp(originalIndex)}
                      disabled={originalIndex === 0}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown(originalIndex)}
                      disabled={originalIndex === kpis.length - 1}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditKpi(kpi)}
                      className="p-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteKpi(kpi.id)}
                      className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20">
        <button
          type="button"
          onClick={onBackToProfile}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Edit Profil Divisi</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onExport}
            disabled={activeKpis.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export ({activeKpis.length})</span>
          </button>

          <button
            type="button"
            onClick={onProceedToOfficer}
            disabled={activeKpis.length === 0}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 transition shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <span>Cascade ke Menu KPI Officer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

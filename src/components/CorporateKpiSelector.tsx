import React, { useState } from 'react';
import { 
  Check, 
  Search, 
  CheckSquare, 
  Square, 
  Lock, 
  ArrowRight, 
  Layers, 
  Percent, 
  Target,
  Sparkles,
  Info
} from 'lucide-react';
import { CorporateKPI, BSCCategory } from '../types';
import { CORPORATE_KPIS, BSC_PERSPECTIVE_META } from '../data/corporateKPIs';

interface CorporateKpiSelectorProps {
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectByCategory: (category: BSCCategory) => void;
  onNext: () => void;
}

export const CorporateKpiSelector: React.FC<CorporateKpiSelectorProps> = ({
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onSelectByCategory,
  onNext,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const categories: BSCCategory[] = ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'];

  // Calculate selected total weight
  const selectedKpis = CORPORATE_KPIS.filter(k => selectedIds.includes(k.id));
  const totalSelectedWeight = selectedKpis.reduce((acc, curr) => acc + curr.weightValue, 0);

  const filteredKpis = CORPORATE_KPIS.filter(kpi => {
    const matchesSearch = 
      kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (kpi.description && kpi.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategoryFilter === 'ALL' || kpi.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Directive Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Tahap 1 dari 3
              </span>
              <span className="text-xs text-slate-500 font-medium">Input KPI Korporat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pilih KPI Korporat yang Relevan dengan Divisi
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Pilih satu atau lebih dari 17 KPI Korporat di bawah ini yang selaras dengan tugas pokok dan fungsi divisi Anda.
            </p>
          </div>

          {/* KPI Selection Metric Badge */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 self-start lg:self-center">
            <div className="text-center px-2">
              <span className="text-xs text-slate-500 block font-medium">KPI Terpilih</span>
              <span className="text-lg font-bold text-blue-700">
                {selectedIds.length} <span className="text-xs font-normal text-slate-400">/ 17</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-500 block font-medium">Total Bobot</span>
              <span className="text-lg font-bold text-emerald-700">
                {totalSelectedWeight}%
              </span>
            </div>
          </div>
        </div>

        {/* System Integrity Notification */}
        <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ketentuan Baku Korporat:</span> AI dan sistem MARKPITER tidak akan mengubah nama, bobot, perspektif, maupun target dari 17 KPI Korporat resmi. Seluruh formulasi KPI Divisi akan diturunkan secara konsisten mengacu pada KPI yang Anda centang.
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Category Chips & Select All Buttons */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari KPI Korporat (mis: GeoHazard, UAG, Gas Delivered)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Perspective Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition cursor-pointer shrink-0 ${
              activeCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Semua (17)
          </button>
          {categories.map((cat) => {
            const count = CORPORATE_KPIS.filter(k => k.category === cat).length;
            const isCatActive = activeCategoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border transition cursor-pointer shrink-0 ${
                  isCatActive
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 justify-end">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
            Pilih Semua
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 text-slate-500" />
            Batal Semua
          </button>
        </div>
      </div>

      {/* Grouped Category Display */}
      <div className="space-y-6">
        {categories.map((category) => {
          const catKpis = filteredKpis.filter(k => k.category === category);
          if (catKpis.length === 0) return null;

          const meta = BSC_PERSPECTIVE_META[category];
          const allInCatSelected = catKpis.every(k => selectedIds.includes(k.id));

          return (
            <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Category Header */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${meta.bgBadge}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {meta.desc}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectByCategory(category)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  {allInCatSelected ? 'Batalkan Perspektif Ini' : 'Pilih Semua di Perspektif Ini'}
                </button>
              </div>

              {/* Cards Grid: Every card displays KPI Name | Weight | Target */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {catKpis.map((kpi) => {
                  const isSelected = selectedIds.includes(kpi.id);

                  return (
                    <div
                      key={kpi.id}
                      onClick={() => onToggleSelect(kpi.id)}
                      className={`group relative rounded-lg border-2 p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Top row: Checkbox & Name */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 bg-white group-hover:border-blue-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              {kpi.code}
                            </span>
                          </div>

                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {kpi.category}
                          </span>
                        </div>

                        {/* KPI Name */}
                        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                          {kpi.name}
                        </h4>

                        {kpi.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                            {kpi.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom row: Weight & Target as required strictly */}
                      <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Percent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Bobot:</span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-bold text-[11px]">
                            {kpi.weight}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 font-medium text-slate-800 text-right truncate">
                          <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-500">Target:</span>
                          <span className="font-bold text-emerald-700 truncate" title={kpi.target}>
                            {kpi.target}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating / Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>{selectedIds.length} KPI Korporat</strong> dipilih (Total Bobot: <strong>{totalSelectedWeight}%</strong>).
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={selectedIds.length === 0}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition shadow-sm cursor-pointer ${
            selectedIds.length > 0
              ? 'bg-blue-700 hover:bg-blue-800 active:scale-98'
              : 'bg-slate-400 cursor-not-allowed opacity-75'
          }`}
        >
          <span>Lanjut ke Input Profil Divisi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

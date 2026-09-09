import React, { useState, useEffect } from 'react';
import { X, Save, Plus, HelpCircle, ShieldCheck } from 'lucide-react';
import { DivisionKPI, OfficerKPI, BSCCategory } from '../types';
import { PIPELINE_STANDARDS } from '../data/pipelineStandards';

interface KpiEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'division' | 'officer';
  initialData?: DivisionKPI | OfficerKPI | null;
  onSaveDivisionKpi?: (kpi: DivisionKPI) => void;
  onSaveOfficerKpi?: (kpi: OfficerKPI) => void;
  divisionName?: string;
  availableDivisionKpis?: DivisionKPI[];
}

export const KpiEditModal: React.FC<KpiEditModalProps> = ({
  isOpen,
  onClose,
  type,
  initialData,
  onSaveDivisionKpi,
  onSaveOfficerKpi,
  divisionName = 'Divisi',
  availableDivisionKpis = [],
}) => {
  const [name, setName] = useState('');
  const [definition, setDefinition] = useState('');
  const [formula, setFormula] = useState('');
  const [unit, setUnit] = useState('%');
  const [target, setTarget] = useState('100.00%');
  const [kpiType, setKpiType] = useState<BSCCategory>('Internal Process');
  const [owner, setOwner] = useState('');
  const [cascadedFrom, setCascadedFrom] = useState('');
  const [rationale, setRationale] = useState('');
  const [standardRef, setStandardRef] = useState('ASME B31.8S / API 1160');

  useEffect(() => {
    if (initialData) {
      if (type === 'division') {
        const d = initialData as DivisionKPI;
        setName(d.divisionKpi || '');
        setDefinition(d.definition || '');
        setFormula(d.measurementFormula || '');
        setUnit(d.unit || '%');
        setTarget(d.target || '100%');
        setKpiType(d.kpiType || 'Internal Process');
        setOwner(d.kpiOwner || `Kepala ${divisionName}`);
        setRationale(d.rationale || '');
        setStandardRef(d.gasStandardRef || '');
      } else {
        const o = initialData as OfficerKPI;
        setName(o.officerKpi || '');
        setDefinition(o.definition || '');
        setFormula(o.measurementFormula || '');
        setUnit(o.unit || '%');
        setTarget(o.target || '100%');
        setKpiType(o.kpiType || 'Internal Process');
        setCascadedFrom(o.cascadedFromDivisionKpi || '');
        setRationale(o.rationale || '');
        setStandardRef(o.gasStandardRef || '');
      }
    } else {
      // Defaults for new KPI
      setName('');
      setDefinition('');
      setFormula('(Realisasi / Target) * 100%');
      setUnit('%');
      setTarget('100.00%');
      setKpiType('Internal Process');
      setOwner(`Kepala ${divisionName}`);
      setCascadedFrom(availableDivisionKpis[0]?.divisionKpi || '');
      setRationale('');
      setStandardRef('ASME B31.8S / API 1160');
    }
  }, [initialData, type, divisionName, availableDivisionKpis]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'division' && onSaveDivisionKpi) {
      const updated: DivisionKPI = {
        id: initialData?.id || `div-kpi-manual-${Date.now()}`,
        divisionKpi: name,
        definition,
        measurementFormula: formula,
        unit,
        target,
        kpiType,
        kpiOwner: owner || `Kepala ${divisionName}`,
        rationale,
        gasStandardRef: standardRef,
        isSelected: true,
      };
      onSaveDivisionKpi(updated);
    } else if (type === 'officer' && onSaveOfficerKpi) {
      const updated: OfficerKPI = {
        id: initialData?.id || `off-kpi-manual-${Date.now()}`,
        officerKpi: name,
        definition,
        measurementFormula: formula,
        unit,
        target,
        kpiType,
        cascadedFromDivisionKpi: cascadedFrom || 'KPI Divisi Terkait',
        rationale,
        gasStandardRef: standardRef,
        isSelected: true,
      };
      onSaveOfficerKpi(updated);
    }
    onClose();
  };

  const categories: BSCCategory[] = ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">
              {initialData ? 'Edit KPI' : 'Tambah KPI Baru'} ({type === 'division' ? 'Tingkat Divisi' : 'Tingkat Officer'})
            </h3>
            <p className="text-xs text-slate-300">
              Pastikan nama KPI terukur, memiliki formula baku, dan selaras dengan standar operasi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          
          {/* KPI Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama KPI <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ketercapaian Program ILI Smart Pigging Pipa Transmisi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Definition */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Definisi / Penjelasan KPI
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan secara ringkas maksud dan batasan KPI ini..."
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Type & Unit & Target Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                KPI Type (Balanced Scorecard)
              </label>
              <select
                value={kpiType}
                onChange={(e) => setKpiType(e.target.value as BSCCategory)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Satuan (Unit)
              </label>
              <input
                type="text"
                placeholder="%, Hari, MMscfd, Kasus"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target
              </label>
              <input
                type="text"
                placeholder="100%, Zero LTI, Max 0.175%"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Formula */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Measurement / Formula Pengukuran
            </label>
            <input
              type="text"
              placeholder="(Realisasi / Target Rencana) * 100%"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full text-xs font-mono p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Cascaded From (for Officer) OR KPI Owner (for Division) */}
          {type === 'officer' ? (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Diturunkan Dari KPI Divisi:
              </label>
              <select
                value={cascadedFrom}
                onChange={(e) => setCascadedFrom(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
              >
                {availableDivisionKpis.map((dk) => (
                  <option key={dk.id} value={dk.divisionKpi}>
                    {dk.divisionKpi}
                  </option>
                ))}
                <option value="KPI Divisi Terkait">Lainnya / Manual</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                KPI Owner (Pemilik KPI)
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
              />
            </div>
          )}

          {/* Rationale */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Rationale / Alasan Relevansi
            </label>
            <textarea
              rows={2}
              placeholder="Alasan mengapa KPI ini kritikal bagi pencapaian target korporat..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full text-sm p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Gas Standard Ref */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Standar Acuan Transmisi Gas (ASME/API/PHMSA/ISO)
            </label>
            <input
              type="text"
              placeholder="Contoh: ASME B31.8S / API 1160 / NACE SP0169 / PHMSA 192"
              value={standardRef}
              onChange={(e) => setStandardRef(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan KPI</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

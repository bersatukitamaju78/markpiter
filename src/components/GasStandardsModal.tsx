import React, { useState } from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';
import { PIPELINE_STANDARDS } from '../data/pipelineStandards';

interface GasStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasStandardsModal: React.FC<GasStandardsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredStandards = PIPELINE_STANDARDS.filter(std => {
    const matchesSearch = 
      std.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.keyAspects.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOrg = selectedOrg === 'ALL' || std.organization === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const orgs = ['ALL', 'ASME', 'API', 'PHMSA', 'ISO', 'NACE / AMPP'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Kamus Standar Teknis Transmisi Gas Alam</h2>
              <p className="text-xs text-slate-300">
                Pedoman ASME, API, PHMSA, ISO, dan NACE yang digunakan dalam formulasi KPI Divisi & Officer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode standar (mis: B31.8S, 1160)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {orgs.map((org) => (
              <button
                key={org}
                type="button"
                onClick={() => setSelectedOrg(org)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  selectedOrg === org
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {filteredStandards.map((std) => (
            <div
              key={std.code}
              className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 bg-white shadow-xs transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                    {std.organization}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{std.code}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {std.name}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                {std.scope}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Aspek Kunci:
                </span>
                {std.keyAspects.map((aspect, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {aspect}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredStandards.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">Tidak ada standar yang sesuai dengan pencarian "{searchTerm}".</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition cursor-pointer"
          >
            Tutup Referensi
          </button>
        </div>

      </div>
    </div>
  );
};

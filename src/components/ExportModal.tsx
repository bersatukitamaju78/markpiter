import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Table, 
  CheckCircle2 
} from 'lucide-react';
import { DivisionKPI, OfficerKPI, DivisionProfile, OfficerProfile } from '../types';
import { 
  exportDivisionKpisToExcel, 
  exportDivisionKpisToCSV, 
  exportDivisionKpisToTSV, 
  exportOfficerKpisToExcel, 
  exportOfficerKpisToCSV, 
  exportOfficerKpisToTSV, 
  exportAllIntegratedToExcel 
} from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'division' | 'officer' | 'both';
  divisionProfile: DivisionProfile;
  divisionKpis: DivisionKPI[];
  officerProfile: OfficerProfile;
  officerKpis: OfficerKPI[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  type,
  divisionProfile,
  divisionKpis,
  officerProfile,
  officerKpis,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv' | 'sheets'>('excel');
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!isOpen) return null;

  const activeDivKpis = divisionKpis.filter(k => k.isSelected !== false);
  const activeOffKpis = officerKpis.filter(k => k.isSelected !== false);

  const handleDownload = () => {
    if (selectedFormat === 'excel') {
      if (type === 'division') {
        exportDivisionKpisToExcel(divisionProfile, activeDivKpis);
      } else if (type === 'officer') {
        exportOfficerKpisToExcel(officerProfile, activeOffKpis);
      } else {
        exportAllIntegratedToExcel(divisionProfile, activeDivKpis, officerProfile, activeOffKpis);
      }
    } else if (selectedFormat === 'csv') {
      if (type === 'division') {
        exportDivisionKpisToCSV(divisionProfile, activeDivKpis);
      } else {
        exportOfficerKpisToCSV(officerProfile, activeOffKpis);
      }
    } else if (selectedFormat === 'sheets') {
      handleCopyForSheets();
    }
  };

  const handleCopyForSheets = () => {
    const tsvContent = type === 'division' 
      ? exportDivisionKpisToTSV(activeDivKpis)
      : exportOfficerKpisToTSV(activeOffKpis);

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 4000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Export Matriks KPI MARKPITER</h3>
              <p className="text-xs text-slate-300">
                Format resmi sesuai struktur standar korporat transmisi gas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Format Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pilih Format Export
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: Excel */}
              <div
                onClick={() => setSelectedFormat('excel')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'excel'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Excel (.xlsx)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Workbook lengkap dengan metadata profil, formula, dan header berwarna resmi.
                </p>
              </div>

              {/* Option 2: CSV */}
              <div
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-blue-100 text-blue-800">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">CSV (.csv)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Format teks terpisah koma (UTF-8) untuk integrasi database atau ERP sistem.
                </p>
              </div>

              {/* Option 3: Google Sheets */}
              <div
                onClick={() => setSelectedFormat('sheets')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  selectedFormat === 'sheets'
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                    <Table className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Google Sheets</span>
                </div>
                <p className="text-xs text-slate-500">
                  Salin 1-klik format TSV untuk langsung di-paste (Ctrl+V) ke spreadsheet online.
                </p>
              </div>

            </div>
          </div>

          {/* Included Columns Checklist Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">
              Struktur Kolom Matriks yang Diexport:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                KPI Name
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Definition
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Formula
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Unit
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Target
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                KPI Type
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {type === 'officer' ? 'Cascaded From' : 'KPI Owner'}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Rationale & Standard
              </span>
            </div>
          </div>

          {/* Special message for Google Sheets */}
          {selectedFormat === 'sheets' && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Copy className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                Klik tombol <strong>"Salin ke Clipboard"</strong> di bawah, lalu buka Google Sheets baru dan tekan <strong>Ctrl + V</strong> pada sel A1. Seluruh kolom dan baris akan tertata rapi secara otomatis.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {selectedFormat === 'sheets' ? (
              <button
                type="button"
                onClick={handleCopyForSheets}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm cursor-pointer"
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Data untuk Google Sheets</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File {selectedFormat.toUpperCase()}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
